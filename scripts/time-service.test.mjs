import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import test from 'node:test'
import { createTimeService, timeConfig } from '../server/time-service.mjs'
import { parseReply, readTimestamp } from '../server/ntp.mjs'

const sample = { serverTimeMs: 1792728000000, sampledAtMono: 100, ntpRoundTripMs: 20 }
test('KRISS is default and the allowlist contains exactly the requested servers', () => {
  assert.equal(timeConfig.defaultServer, 'ntp.kriss.re.kr')
  assert.equal(timeConfig.fallbackServer, 'time.nist.gov')
  assert.equal(timeConfig.servers.length, 6)
})
test('uses selected NTP source and advances cached timestamps with a monotonic clock', async () => {
  let mono = 100
  let calls = 0
  const getTime = createTimeService({ query: async () => { calls++; return sample }, monoNow: () => mono })
  const first = await getTime()
  assert.equal(first.sourceServer, timeConfig.defaultServer)
  mono += 1000
  const next = await getTime()
  assert.equal(next.serverTimeMs, first.serverTimeMs + 1000)
  assert.equal(calls, 1)
})
test('falls back to NIST and reports the real source', async () => {
  const calls = []
  const getTime = createTimeService({ monoNow: () => 100, query: async (host) => {
    calls.push(host)
    if (host !== 'time.nist.gov') throw new Error('timeout')
    return sample
  } })
  const result = await getTime('time.google.com')
  assert.deepEqual(calls, ['time.google.com', 'time.nist.gov'])
  assert.equal(result.sourceServer, 'time.nist.gov')
  assert.equal(result.requestedServer, 'time.google.com')
  assert.equal(result.fallbackUsed, true)
})
test('reports failure instead of substituting the device clock when both sources fail', async () => {
  const getTime = createTimeService({ query: async () => { throw new Error('offline') } })
  await assert.rejects(getTime(), /offline/)
  await assert.rejects(getTime('time.nist.gov'), /NIST/)
})
test('rejects arbitrary destinations and deduplicates concurrent clients', async () => {
  let calls = 0
  const getTime = createTimeService({ query: async () => { calls++; return sample }, monoNow: () => 100 })
  await assert.rejects(getTime('127.0.0.1'), /Unsupported/)
  await Promise.all([getTime(), getTime(), getTime()])
  assert.equal(calls, 1)
})

const writeTimestamp = (packet, offset, ms) => {
  const value = ms / 1000 + 2208988800
  packet.writeUInt32BE(Math.floor(value) % 2 ** 32, offset)
  packet.writeUInt32BE(Math.floor((value % 1) * 2 ** 32), offset + 4)
}
test('validates an NTP reply and compensates for symmetric network delay', () => {
  const request = Buffer.alloc(48)
  const reply = Buffer.alloc(48)
  const base = 1792728000000
  writeTimestamp(request, 40, base)
  request.copy(reply, 24, 40, 48)
  reply[0] = 0x24
  reply[1] = 2
  writeTimestamp(reply, 32, base + 1020)
  writeTimestamp(reply, 40, base + 1025)
  const result = parseReply(reply, request, base, base + 45)
  assert.ok(Math.abs(result.serverTimeMs - (base + 1045)) < 0.01)
  assert.ok(Math.abs(result.ntpRoundTripMs - 40) < 0.01)
  reply[1] = 0
  assert.throws(() => parseReply(reply, request, base, base + 45), /rate-limited/)
  reply[1] = 2
  reply[24] ^= 1
  assert.throws(() => parseReply(reply, request, base, base + 45), /mismatch/)
  assert.throws(() => parseReply(Buffer.alloc(10), request, base, base + 45), /Truncated/)
})
test('decodes the NTP era after the 2036 rollover', () => {
  const packet = Buffer.alloc(48)
  const date = Date.UTC(2040, 0, 1)
  writeTimestamp(packet, 40, date)
  assert.equal(readTimestamp(packet, 40, date), date)
})
