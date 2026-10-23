import { Buffer } from 'node:buffer'
import { createSocket } from 'node:dgram'
import { performance } from 'node:perf_hooks'

const NTP_EPOCH = 2208988800
const ERA = 2 ** 32

export const readTimestamp = (packet, offset, nearMs) => {
  const seconds = packet.readUInt32BE(offset)
  const fraction = packet.readUInt32BE(offset + 4) / ERA
  const nearNtpSeconds = nearMs / 1000 + NTP_EPOCH
  const era = Math.round((nearNtpSeconds - seconds) / ERA)
  return (seconds + era * ERA - NTP_EPOCH + fraction) * 1000
}

export const parseReply = (reply, request, sentAtMs, receivedAtMs) => {
  if (reply.length < 48) throw new Error('Truncated NTP response')
  const mode = reply[0] & 7
  const version = (reply[0] >> 3) & 7
  if (mode !== 4 || ![3, 4].includes(version) || reply[0] >> 6 === 3) throw new Error('Invalid NTP server state')
  if (reply[1] < 1 || reply[1] > 15) throw new Error('Unsynchronized or rate-limited NTP server')
  if (!reply.subarray(24, 32).equals(request.subarray(40, 48))) throw new Error('NTP request mismatch')
  if (reply.subarray(32, 40).equals(Buffer.alloc(8)) || reply.subarray(40, 48).equals(Buffer.alloc(8))) throw new Error('Missing NTP timestamp')
  const received = readTimestamp(reply, 32, receivedAtMs)
  const transmitted = readTimestamp(reply, 40, receivedAtMs)
  const serverProcessing = transmitted - received
  const elapsed = receivedAtMs - sentAtMs
  if (serverProcessing < -1 || serverProcessing > elapsed + 5) throw new Error('Invalid NTP timing')
  const offsetMs = ((received - sentAtMs) + (transmitted - receivedAtMs)) / 2
  return { serverTimeMs: receivedAtMs + offsetMs, ntpRoundTripMs: Math.max(0, elapsed - serverProcessing) }
}

export const queryNtp = (host, timeoutMs = 3000) => new Promise((resolve, reject) => {
  const socket = createSocket('udp4')
  const request = Buffer.alloc(48)
  request[0] = 0x23 // NTP v4, client mode
  let sentAtMs
  let sentAtMono
  let finished = false
  const finish = (error, result) => {
    if (finished) return
    finished = true
    clearTimeout(timer)
    try { socket.close() } catch { /* A failed DNS lookup may leave it unbound. */ }
    if (error) reject(error)
    else resolve(result)
  }
  const timer = setTimeout(() => finish(new Error(`NTP timeout: ${host}`)), timeoutMs)
  socket.once('error', (error) => finish(error))
  socket.once('message', (reply) => {
    const receivedAtMono = performance.now()
    const receivedAtMs = sentAtMs + receivedAtMono - sentAtMono
    try {
      finish(null, { ...parseReply(reply, request, sentAtMs, receivedAtMs), sampledAtMono: receivedAtMono })
    } catch (error) { finish(error) }
  })
  // Connected UDP accepts replies from the chosen server endpoint only.
  socket.connect(123, host, () => {
    if (finished) return
    sentAtMs = Date.now()
    sentAtMono = performance.now()
    const ntpSeconds = sentAtMs / 1000 + NTP_EPOCH
    request.writeUInt32BE(Math.floor(ntpSeconds) % ERA, 40)
    request.writeUInt32BE(Math.floor((ntpSeconds % 1) * ERA), 44)
    socket.send(request, (error) => { if (error) finish(error) })
  })
})
