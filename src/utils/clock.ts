export const clockTime = (date: Date, use24Hour: boolean) => {
  const hours = date.getHours()
  const seconds = date.getSeconds() + date.getMilliseconds() / 1000
  const minutes = date.getMinutes() + seconds / 60
  const pad = (value: number, digits = 2) => String(value).padStart(digits, '0')
  return {
    digital: `${pad(use24Hour ? hours : hours % 12 || 12)}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
    period: hours < 12 ? 'AM' : 'PM',
    hour: hours % 12 || 12,
    minuteProgress: minutes,
  }
}

// Advance once per wall-clock second, overshoot slightly, then settle.
// Computing from wall time also avoids drift after a suspended browser tab.
export const secondOrbitAngle = (date: Date, reducedMotion = false): number => {
  const target = date.getSeconds() * 6
  const elapsed = date.getMilliseconds() / 1000
  if (reducedMotion || elapsed >= 0.64) return target
  const stops = [[0, -6], [0.22, 0.8 / 3], [0.38, -0.3 / 3], [0.5, 0.1 / 3], [0.64, 0]]
  const end = stops.findIndex(([time]) => time > elapsed)
  const [startTime, startOffset] = stops[end - 1]
  const [endTime, endOffset] = stops[end]
  const progress = (elapsed - startTime) / (endTime - startTime)
  const eased = progress * progress * (3 - 2 * progress)
  return target + startOffset + (endOffset - startOffset) * eased
}

// Each minute softly fills one dash. Sway affects only the fading edge,
// so completed minutes stay lit and the actual minute boundary stays accurate.
export const minuteLightOpacity = (progress: number, index: number, sway = 0): number => {
  const fraction = Math.max(0, Math.min(1, progress - index))
  const eased = fraction * fraction * (3 - 2 * fraction)
  return Math.max(0, Math.min(1, eased + sway * Math.sin(Math.PI * fraction)))
}
