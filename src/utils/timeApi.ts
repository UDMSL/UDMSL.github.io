export const TIME_API_URL = 'https://timeapi.io/api/time/current/zone?timeZone=UTC'

// TimeAPI's dateTime has no offset. Parse only the explicitly requested UTC zone.
export const parseTimeApi = (data: unknown): number => {
  if (!data || typeof data !== 'object') throw new Error('Invalid time response')
  const value = data as Record<string, unknown>
  if (value.timeZone !== 'UTC' || typeof value.dateTime !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,7})?$/.test(value.dateTime)) {
    throw new Error('Expected UTC time')
  }
  // JavaScript stores milliseconds, even when the API returns seven decimals.
  const iso = value.dateTime.replace(/(\.\d{3})\d+$/, '$1') + 'Z'
  const epoch = Date.parse(iso)
  const date = new Date(epoch)
  if (!Number.isFinite(epoch) || date.getUTCFullYear() < 2020 || date.getUTCFullYear() > 2100 ||
    date.getUTCFullYear() !== value.year || date.getUTCMonth() + 1 !== value.month ||
    date.getUTCDate() !== value.day || date.getUTCHours() !== value.hour ||
    date.getUTCMinutes() !== value.minute || date.getUTCSeconds() !== value.seconds ||
    date.getUTCMilliseconds() !== value.milliSeconds) throw new Error('Invalid UTC fields')
  return epoch
}

export type TimeSample = { serverTimeMs: number; monoMs: number; roundTripMs: number }
export const compensateTimeSample = (epoch: number, sent: number, received: number): TimeSample => {
  const roundTripMs = received - sent
  if (!Number.isFinite(epoch) || !Number.isFinite(roundTripMs) || roundTripMs < 0 || roundTripMs > 5000) {
    throw new Error('Time response too slow or invalid')
  }
  // Approximation: HTTPS exposes no separate server receive/transmit timestamps.
  return { serverTimeMs: epoch + roundTripMs / 2, monoMs: received, roundTripMs }
}
