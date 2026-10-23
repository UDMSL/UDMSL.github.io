import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { setImmediate } from 'node:timers/promises'
import ts from 'typescript'

const source = await readFile(new URL('../src/utils/timeApi.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { parseTimeApi, compensateTimeSample } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const data = { year: 2026, month: 10, day: 23, hour: 7, minute: 30, seconds: 37, milliSeconds: 669, dateTime: '2026-10-23T07:30:37.6695197', timeZone: 'UTC' }

test('offsetless UTC and submillisecond decimals parse independently of device timezone', () => {
  assert.equal(parseTimeApi(data), Date.UTC(2026, 9, 23, 7, 30, 37, 669))
  assert.equal(parseTimeApi({ ...data, dateTime: '2026-10-23T07:30:37', milliSeconds: 0 }), Date.UTC(2026, 9, 23, 7, 30, 37))
})
test('rejects mismatched timezone, missing fields, impossible dates and invalid timestamps', () => {
  for (const invalid of [null, {}, { ...data, timeZone: 'Asia/Seoul' }, { ...data, dateTime: data.dateTime + 'Z' },
    { ...data, day: 24 }, { ...data, dateTime: '2026-02-30T07:30:37.669', month: 2, day: 30 },
    { ...data, dateTime: '1900-10-23T07:30:37.669', year: 1900 }, { ...data, milliSeconds: undefined }]) {
    assert.throws(() => parseTimeApi(invalid))
  }
})
test('half RTT correction stays anchored to monotonic receive time', () => {
  const epoch = parseTimeApi(data)
  const sample = compensateTimeSample(epoch, 1000, 1310)
  assert.deepEqual(sample, { serverTimeMs: epoch + 155, monoMs: 1310, roundTripMs: 310 })
  assert.equal(sample.serverTimeMs + (2310 - sample.monoMs), epoch + 1155)
  for (const received of [999, 6001, NaN, Infinity]) assert.throws(() => compensateTimeSample(epoch, 1000, received))
})

const hookSource = await readFile(new URL('../src/hooks/useNetworkTime.ts', import.meta.url), 'utf8')
const hookJs = ts.transpileModule(hookSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const createHook = new Function('useCallback', 'useEffect', 'useRef', 'useState', 'TIME_API_URL', 'parseTimeApi', 'compensateTimeSample', 'window', 'document', 'performance', 'fetch',
  hookJs.replace(/^import .*$/gm, '').replace('export const useNetworkTime', 'const useNetworkTime') + '\nreturn useNetworkTime')
const harness = (responses) => {
  let mono = 1000
  let effect
  let interval
  let stateIndex = 0
  const states = []
  const queue = [...responses]
  const hook = createHook((fn) => fn, (fn) => { effect = fn }, (value) => ({ current: value }), (initial) => {
    const index = stateIndex++
    states[index] = initial
    return [initial, (next) => { states[index] = typeof next === 'function' ? next(states[index]) : next }]
  }, 'https://timeapi.io/test', parseTimeApi, compensateTimeSample,
  { setTimeout: () => 0, setInterval: (fn) => { interval = fn; return 0 }, addEventListener() {}, removeEventListener() {} },
  { hidden: false, addEventListener() {}, removeEventListener() {} }, { now: () => mono }, async () => {
    const response = queue.shift()
    mono += response?.duration || 10
    if (!response || response.error) throw new Error('offline')
    return { ok: true, headers: new Map(), json: async () => data }
  })()
  const cleanup = effect()
  return { hook, state: () => states[0], advance: (ms) => { mono += ms }, tick: () => interval(), cleanup }
}

test('selects the fastest sample and retains it through outages, then expires after 15 minutes', async () => {
  const clock = harness([{ duration: 1000 }, { duration: 300 }, { duration: 500 }])
  await setImmediate()
  assert.equal(clock.state().status, 'synced')
  assert.equal(clock.state().roundTripMs, 300)
  assert.equal(clock.hook.now(), parseTimeApi(data) + 650)
  clock.tick()
  await setImmediate()
  assert.equal(clock.state().status, 'holdover')
  assert.ok(clock.hook.now() > parseTimeApi(data))
  clock.advance(15 * 60000)
  assert.equal(clock.hook.now(), null)
  clock.tick()
  await setImmediate()
  assert.equal(clock.state().status, 'error')
  clock.cleanup()
})
test('initial outage never substitutes device time; cancelled requests cannot publish a sample', async () => {
  const offline = harness([])
  await setImmediate()
  assert.equal(offline.state().status, 'error')
  assert.equal(offline.hook.now(), null)
  offline.cleanup()
  const cancelled = harness([{ duration: 300 }])
  cancelled.cleanup()
  await setImmediate()
  assert.equal(cancelled.hook.now(), null)
})
