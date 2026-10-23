import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { AlignLeft, AlignRight, Expand, Minimize, Eye, EyeOff } from 'lucide-react'
import { clockTime, minuteLightOpacity, secondOrbitAngle } from '../utils/clock'
import './ExamClock.css'
import { useNetworkTime } from '../hooks/useNetworkTime'
import { fitMemoFontSize } from '../utils/memo'

const STORAGE_KEY = 'udms-exam-clock-preview-v1'
type Settings = { note: string; side: 'left' | 'right'; use24Hour: boolean; animateSeconds: boolean }

const readSettings = (): Settings => {
  const defaults: Settings = { note: '', side: 'left', use24Hour: true, animateSeconds: true }
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      note: typeof saved.note === 'string' ? saved.note : defaults.note,
      side: saved.side === 'right' ? 'right' : 'left',
      use24Hour: typeof saved.use24Hour === 'boolean' ? saved.use24Hour : true,
      animateSeconds: typeof saved.animateSeconds === 'boolean' ? saved.animateSeconds : true,
    }
  } catch { return defaults }
}

const LightHourClock = ({ use24Hour, animateSeconds, now }: { use24Hour: boolean; animateSeconds: boolean; now: () => number | null }) => {
  const lightsRef = useRef<SVGGElement>(null)
  const hoursRef = useRef<SVGGElement>(null)
  const glowId = useId()
  const faceId = useId()
  const digitalRef = useRef<HTMLSpanElement>(null)
  const secondRef = useRef<SVGGElement>(null)
  const periodRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    let previousDigital = ''
    let previousHour = -1
    const lights = lightsRef.current?.querySelectorAll('line')
    const hours = hoursRef.current?.querySelectorAll('text')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      const serverNow = now()
      if (serverNow === null) {
        if (digitalRef.current) digitalRef.current.textContent = '--:--:--'
        previousDigital = ''
        previousHour = -1
        lights?.forEach((light) => light.setAttribute('opacity', '0'))
        hours?.forEach((hour) => hour.setAttribute('data-active', 'false'))
        secondRef.current?.setAttribute('visibility', 'hidden')
        frame = requestAnimationFrame(update)
        return
      }
      const currentDate = new Date(serverNow)
      const time = clockTime(currentDate, use24Hour)
      secondRef.current?.setAttribute('visibility', 'visible')
      // The explicit user control takes precedence over the system motion setting.
      secondRef.current?.setAttribute('transform', `rotate(${secondOrbitAngle(currentDate, !animateSeconds)} 200 200)`)
      const sway = reducedMotion.matches ? 0 : Math.sin(serverNow * Math.PI * 2 / 9000) * 0.08
      lights?.forEach((light, index) => {
        light.setAttribute('opacity', minuteLightOpacity(time.minuteProgress, index, sway).toFixed(4))
      })
      if (time.hour !== previousHour) {
        hours?.forEach((hour, index) => hour.setAttribute('data-active', String(time.hour === index + 1)))
        previousHour = time.hour
      }
      if (digitalRef.current && time.digital !== previousDigital) {
        digitalRef.current.textContent = time.digital
        previousDigital = time.digital
      }
      if (periodRef.current) periodRef.current.textContent = use24Hour ? '24 HOUR' : time.period
      frame = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(frame)
  }, [use24Hour, animateSeconds, now])

  return (
    <div className="exam-clock-face" role="img" aria-label="현재 시의 숫자가 빛나고 분의 빛이 시계 방향으로 채워지는 시계. 바깥쪽 작은 원이 매초 이동하며 중앙에 시·분·초를 표시합니다.">
      <svg viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          <radialGradient id={faceId}>
            <stop offset="0%" stopColor="#101010" />
            <stop offset="78%" stopColor="#090909" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="0.8" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx="200" cy="200" r="195" fill={`url(#${faceId})`} stroke="#333333" strokeWidth="1" />
        <circle cx="200" cy="200" r="191" fill="none" stroke="#181818" />
        {Array.from({ length: 60 }, (_, i) => (
          <line key={i} x1="200" y1="17" x2="200" y2={i % 5 === 0 ? 30 : 27}
            transform={`rotate(${i * 6} 200 200)`} stroke="#484848" strokeWidth="1.7" strokeLinecap="round" />
        ))}
        <g ref={lightsRef} filter={`url(#${glowId})`}>
          {Array.from({ length: 60 }, (_, i) => (
            <line key={i} x1="200" y1="17" x2="200" y2={i % 5 === 0 ? 30 : 27}
              transform={`rotate(${i * 6} 200 200)`} stroke="#ffffff" opacity="0" strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </g>
        <g ref={hoursRef} className="exam-clock-hour-numbers">
          {Array.from({ length: 12 }, (_, i) => {
            const hour = i + 1
            const angle = hour * Math.PI / 6
            return <text key={hour} x={200 + 139 * Math.sin(angle)} y={200 - 139 * Math.cos(angle)}
              dominantBaseline="central" textAnchor="middle" fontSize="30" fontFamily="system-ui, sans-serif" fontWeight="500">{hour}</text>
          })}
        </g>
        <g ref={secondRef} className="exam-clock-second-orbit">
          <circle cx="200" cy="-7" r="3.2" fill="#ffffff" />
        </g>
      </svg>
      <div className="exam-clock-digital" aria-hidden="true">
        <span className="exam-clock-period" ref={periodRef} />
        <div className="exam-clock-time"><span ref={digitalRef} /></div>
      </div>
    </div>
  )
}

const ExamClock = ({ preview = false }: { preview?: boolean }) => {
  const [settings, setSettings] = useState(readSettings)
  const networkTime = useNetworkTime()
  const [focused, setFocused] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [notice, setNotice] = useState('')
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const noteAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) }
      catch { setNotice('이 브라우저에서는 메모를 저장할 수 없습니다. 새로고침 전에 복사해 주세요.') }
    }, 250)
    return () => clearTimeout(timer)
  }, [settings])

  useLayoutEffect(() => {
    const note = noteRef.current
    const area = noteAreaRef.current
    const context = document.createElement('canvas').getContext('2d')
    if (!note || !area || !context) return
    let cancelled = false
    let lastDimensions = ''
    const fit = () => {
      // Measure a fixed editor area, never the textarea whose font we change.
      // This breaks the resize -> font -> scrollbar -> resize feedback loop.
      const width = area.clientWidth - 8
      const height = area.clientHeight - 8
      if (cancelled || width <= 0 || height <= 0) return
      const dimensions = `${width}:${height}`
      if (dimensions === lastDimensions) return
      lastDimensions = dimensions
      const style = getComputedStyle(note)
      context.font = `${style.fontWeight} 100px ${style.fontFamily}`
      const fontSize = `${fitMemoFontSize(settings.note || note.placeholder, width, height,
        (line) => context.measureText(line).width)}px`
      if (note.style.fontSize !== fontSize) note.style.fontSize = fontSize
      note.scrollTop = 0
      note.scrollLeft = 0
    }
    const onFonts = () => { lastDimensions = ''; fit() }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(area)
    void document.fonts.ready.then(onFonts)
    document.fonts.addEventListener('loadingdone', onFonts)
    return () => {
      cancelled = true
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', onFonts)
    }
  }, [settings.note])

  useEffect(() => {
    const fullscreenMedia = window.matchMedia('(display-mode: fullscreen)')
    // F11 belongs to the browser and does not always set fullscreenElement.
    // Also observe viewport geometry for browsers without display-mode support.
    const syncFullscreen = () => setFullscreen(
      Boolean(document.fullscreenElement) || fullscreenMedia.matches || (
        window.innerHeight >= window.screen.height - 2 &&
        window.innerWidth >= window.screen.width - 2
      ),
    )
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFocused(false)
        if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
      }
      if (event.key === 'F11') {
        if (document.fullscreenElement) {
          event.preventDefault()
          void document.exitFullscreen().catch(() => {})
        } else if (!fullscreenMedia.matches &&
          !(window.innerHeight >= window.screen.height - 2 && window.innerWidth >= window.screen.width - 2) &&
          typeof document.documentElement.requestFullscreen === 'function') {
          event.preventDefault()
          void document.documentElement.requestFullscreen().catch(() => {
            setNotice('전체 화면을 사용할 수 없습니다. 브라우저의 전체 화면 기능을 사용해 주세요.')
          })
        }
      }
    }
    document.addEventListener('fullscreenchange', syncFullscreen)
    window.addEventListener('resize', syncFullscreen)
    fullscreenMedia.addEventListener('change', syncFullscreen)
    document.addEventListener('keydown', onKey)
    syncFullscreen()
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen)
      window.removeEventListener('resize', syncFullscreen)
      fullscreenMedia.removeEventListener('change', syncFullscreen)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch { setNotice('전체 화면을 사용할 수 없습니다. 브라우저의 전체 화면 기능을 사용해 주세요.') }
  }

  return (
    <section aria-label="시험 시계" className={`exam-clock-page ${focused || fullscreen ? 'is-focused' : ''} ${fullscreen ? 'is-fullscreen' : ''}`}>
      <header className="exam-clock-toolbar">
        <div className="exam-clock-brand"><span className="exam-clock-status" /><h1>시험 시계</h1>{preview && <span className="exam-clock-preview-label">PREVIEW</span>}</div>
        <div className="exam-clock-controls">
          <span className="exam-clock-source">TimeAPI.io</span>
          <button className="exam-clock-motion-button" onClick={networkTime.resync} disabled={networkTime.state.status === 'syncing'}>재동기화</button>
          <div className="exam-clock-toggle" role="group" aria-label="디지털 시계 시간 형식">
            <button aria-pressed={!settings.use24Hour} onClick={() => setSettings({ ...settings, use24Hour: false })}>12H</button>
            <button aria-pressed={settings.use24Hour} onClick={() => setSettings({ ...settings, use24Hour: true })}>24H</button>
          </div>
          <div className="exam-clock-toggle" role="group" aria-label="시계 위치">
            <button aria-label="시계 왼쪽 정렬" title="시계 왼쪽" aria-pressed={settings.side === 'left'} onClick={() => setSettings({ ...settings, side: 'left' })}><AlignLeft size={17} /></button>
            <button aria-label="시계 오른쪽 정렬" title="시계 오른쪽" aria-pressed={settings.side === 'right'} onClick={() => setSettings({ ...settings, side: 'right' })}><AlignRight size={17} /></button>
          </div>
          <button className="exam-clock-motion-button" aria-pressed={settings.animateSeconds} onClick={() => setSettings({ ...settings, animateSeconds: !settings.animateSeconds })}>초 반동 {settings.animateSeconds ? 'ON' : 'OFF'}</button>
          <button className="exam-clock-icon-button" aria-label={fullscreen ? '전체 화면 종료' : '전체 화면'} title="전체 화면" onClick={toggleFullscreen}>{fullscreen ? <Minimize size={18} /> : <Expand size={18} />}</button>
          <button className="exam-clock-icon-button" aria-label="집중 모드" title="집중 모드 · Esc로 해제" onClick={() => setFocused(true)}><EyeOff size={18} /></button>
        </div>
      </header>
      {focused && !fullscreen && <button className="exam-clock-restore" onClick={() => setFocused(false)} aria-label="설정 표시"><Eye size={18} /> 설정 표시</button>}
      <div className={`exam-clock-workspace clock-on-${settings.side}`}>
        <section className="exam-clock-panel" aria-label="시계"><LightHourClock use24Hour={settings.use24Hour} animateSeconds={settings.animateSeconds} now={networkTime.now} /></section>
        <section className="exam-clock-notes" aria-label="시험 안내 메모">
          <label htmlFor="exam-note" className="exam-clock-note-label">MEMO</label>
          <div ref={noteAreaRef} className="exam-clock-note-editor">
            <textarea id="exam-note" ref={noteRef} wrap="off" value={settings.note} onChange={(event) => setSettings({ ...settings, note: event.target.value })}
              placeholder={'시험 안내를\n입력하세요.'} spellCheck={false} aria-label="시험 안내 메모. 입력량에 따라 글자 크기가 자동 조절됩니다." />
          </div>
        </section>
      </div>
      <footer className="exam-clock-footer" aria-live="polite"><span>
        {networkTime.state.status === 'syncing' ? 'TimeAPI.io 동기화 중…' :
          networkTime.state.status === 'synced' ? `TimeAPI.io 기준 · 동기화 완료 · 왕복 ${Math.round(networkTime.state.roundTripMs || 0)} ms (정확도 수치 아님)` : networkTime.state.message}
      </span></footer>
      {(networkTime.state.status === 'error' || networkTime.state.status === 'holdover') &&
        <div className="exam-clock-sync-warning" role="status">{networkTime.state.message}</div>}
      {notice && <div className="exam-clock-notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="알림 닫기">×</button></div>}
    </section>
  )
}

export default ExamClock
