import { useCallback, useEffect, useRef, useState } from 'react'
import { TIME_API_URL, parseTimeApi, compensateTimeSample, type TimeSample } from '../utils/timeApi'

type SyncState = { status: 'syncing' | 'synced' | 'holdover' | 'error'; roundTripMs?: number; message?: string }
const MAX_HOLDOVER_MS = 15 * 60 * 1000

export const useNetworkTime = () => {
  const anchor = useRef<TimeSample | null>(null)
  const [state, setState] = useState<SyncState>({ status: 'syncing' })
  const [retry, setRetry] = useState(0)
  const resync = useCallback(() => setRetry((value) => value + 1), [])
  const now = useCallback(() => {
    const current = anchor.current
    if (!current) return null
    const elapsed = performance.now() - current.monoMs
    if (elapsed > MAX_HOLDOVER_MS || elapsed < 0) return null
    return current.serverTimeMs + elapsed
  }, [])

  useEffect(() => {
    let cancelled = false
    let busy = false
    let controller: AbortController | undefined
    const sync = async () => {
      if (busy || cancelled) return
      busy = true
      setState((previous) => ({ ...previous, status: 'syncing' }))
      let best: TimeSample | null = null
      // Prefer the shortest of three round trips to reduce TLS/queueing bias.
      for (let index = 0; index < 3 && !cancelled; index++) {
        controller = new AbortController()
        const timeout = window.setTimeout(() => controller?.abort(), 5000)
        const sent = performance.now()
        try {
          const response = await fetch(TIME_API_URL, { cache: 'no-store', signal: controller.signal })
          if (!response.ok || response.headers.get('age') && Number(response.headers.get('age')) > 0) throw new Error('Unavailable or cached time')
          const data = await response.json()
          const received = performance.now()
          if (cancelled) return
          const sample = compensateTimeSample(parseTimeApi(data), sent, received)
          if (!best || sample.roundTripMs < best.roundTripMs) {
            best = sample
          }
        } catch {
          // Retain a valid sample from this batch or the last successful sync.
        } finally { clearTimeout(timeout) }
      }
      if (!cancelled && best) {
        anchor.current = best
        setState({ status: 'synced', roundTripMs: best.roundTripMs })
      } else if (!cancelled) {
        const usable = now() !== null
        setState({ status: usable ? 'holdover' : 'error', message: usable
          ? 'TimeAPI.io 재동기화 실패 · 마지막 동기화 시각으로 진행 중 (최대 15분)'
          : 'TimeAPI.io 연결 실패 · 재동기화를 눌러 주세요.' })
      }
      busy = false
    }
    const onVisible = () => { if (!document.hidden) void sync() }
    void sync()
    const timer = window.setInterval(() => { if (!document.hidden) void sync() }, 60000)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('online', onVisible)
    return () => {
      cancelled = true
      controller?.abort()
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('online', onVisible)
    }
  }, [retry, now])

  return { now, state, resync }
}
