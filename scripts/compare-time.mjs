import { writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { queryNtp } from '../server/ntp.mjs'
import config from '../src/data/timeServers.json' with { type: 'json' }
import { TIME_API_URL, parseTimeApi, compensateTimeSample } from '../src/utils/timeApi.ts'

const report = { measuredAt: new Date().toISOString(), method: 'NTP four timestamps; HTTP UTC payload + half full request RTT; all comparisons advanced using performance.now(). Positive delta = API ahead of NTP. Single host, short run, no certified absolute accuracy.', ntp: [], api: [] }
for (let round = 0; round < 3; round++) {
  for (const { host } of config.servers) {
    try { report.ntp.push({ host, round, ...await queryNtp(host) }) }
    catch (error) { report.ntp.push({ host, round, error: error.message }) }
  }
  if (round < 2) await delay(4500)
}
const references = config.servers.map(({ host }) => report.ntp.filter((s) => s.host === host && !s.error).sort((a, b) => a.ntpRoundTripMs - b.ntpRoundTripMs)[0]).filter(Boolean)
for (let i = 0; i < 10; i++) {
  const sent = performance.now()
  try {
    const response = await fetch(TIME_API_URL, { cache: 'no-store', signal: AbortSignal.timeout(10000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    const received = performance.now()
    const epoch = parseTimeApi(data)
    const sample = compensateTimeSample(epoch, sent, received)
    const deltasMs = Object.fromEntries(references.map((ref) => [ref.host, sample.serverTimeMs - (ref.serverTimeMs + received - ref.sampledAtMono)]))
    report.api.push({ index: i, ...sample, payload: data.dateTime, deltasMs })
    console.log(JSON.stringify({ index: i, rtt: sample.roundTripMs, deltasMs }))
  } catch (error) { report.api.push({ index: i, error: error.message }) }
  await delay(350)
}
// Bracket the HTTP run to expose reference-clock drift or a changed route.
report.after = []
for (const { host } of config.servers) {
  try { report.after.push({ host, ...await queryNtp(host) }) }
  catch (error) { report.after.push({ host, error: error.message }) }
}
const median = (values) => { const s = [...values].sort((a, b) => a - b); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2 }
report.summary = references.map((ref) => {
  const deltas = report.api.filter((s) => s.deltasMs).map((s) => s.deltasMs[ref.host])
  const fastest = report.api.filter((s) => s.deltasMs).sort((a, b) => a.roundTripMs - b.roundTripMs)[0]
  const after = report.after.find((s) => s.host === ref.host && !s.error)
  return { host: ref.host, ntpBestRttMs: ref.ntpRoundTripMs, apiMedianDeltaMs: median(deltas), apiMinDeltaMs: Math.min(...deltas), apiMaxDeltaMs: Math.max(...deltas), apiFastestDeltaMs: fastest?.deltasMs[ref.host], referenceChangeMs: after ? after.serverTimeMs - (ref.serverTimeMs + after.sampledAtMono - ref.sampledAtMono) : null }
})
await writeFile(new URL('../server/time-comparison.json', import.meta.url), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ summary: report.summary, apiRttsMs: report.api.map((s) => s.roundTripMs), failures: report.api.filter((s) => s.error) }, null, 2))
