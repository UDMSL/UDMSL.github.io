import { readFileSync } from 'node:fs'
import { performance } from 'node:perf_hooks'
import { queryNtp } from './ntp.mjs'

export const timeConfig = JSON.parse(readFileSync(new URL('../src/data/timeServers.json', import.meta.url), 'utf8'))

export const createTimeService = ({ query = queryNtp, monoNow = () => performance.now() } = {}) => {
  const cache = new Map()
  const pending = new Map()
  const sample = async (host) => {
    const saved = cache.get(host)
    if (saved && monoNow() - saved.cachedAt < (saved.error ? 15000 : 60000)) {
      if (saved.error) throw saved.error
      return saved.value
    }
    if (!pending.has(host)) {
      pending.set(host, query(host).then((value) => {
        cache.set(host, { value, cachedAt: monoNow() })
        return value
      }, (error) => {
        cache.set(host, { error, cachedAt: monoNow() })
        throw error
      }).finally(() => pending.delete(host)))
    }
    return pending.get(host)
  }
  return async (requestedServer = timeConfig.defaultServer) => {
    if (!timeConfig.servers.some(({ host }) => host === requestedServer)) throw new Error('Unsupported time server')
    const started = monoNow()
    let sourceServer = requestedServer
    let value
    try { value = await sample(sourceServer) }
    catch {
      if (sourceServer === timeConfig.fallbackServer) throw new Error('NIST synchronization failed')
      sourceServer = timeConfig.fallbackServer
      value = await sample(sourceServer)
    }
    const now = monoNow()
    return {
      requestedServer,
      sourceServer,
      fallbackUsed: sourceServer !== requestedServer,
      serverTimeMs: value.serverTimeMs + now - value.sampledAtMono,
      processingTimeMs: now - started,
      ntpRoundTripMs: value.ntpRoundTripMs,
      sampleAgeMs: now - value.sampledAtMono,
    }
  }
}
