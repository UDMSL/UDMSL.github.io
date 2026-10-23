import { createServer } from 'node:http'
import process from 'node:process'
import { createTimeService, timeConfig } from './time-service.mjs'

const getTime = createTimeService()
const port = Number(process.env.PORT || 3100)
const host = process.env.HOST || '127.0.0.1'
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://udmsl.github.io'

createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  const origin = request.headers.origin
  if (origin && origin !== allowedOrigin && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    response.writeHead(403).end(JSON.stringify({ error: 'Origin not allowed' }))
    return
  }
  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Vary', 'Origin')
  }
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.writeHead(204).end()
    return
  }
  if (request.method !== 'GET') { response.writeHead(405).end(); return }
  const url = new URL(request.url, 'http://localhost')
  if (url.pathname !== '/api/time') { response.writeHead(404).end(); return }
  const selected = url.searchParams.get('server') || timeConfig.defaultServer
  if (!timeConfig.servers.some(({ host: server }) => server === selected)) {
    response.writeHead(400).end(JSON.stringify({ error: 'Unsupported time server' }))
    return
  }
  try { response.end(JSON.stringify(await getTime(selected))) }
  catch { response.writeHead(503).end(JSON.stringify({ error: '선택한 서버와 NIST 동기화에 실패했습니다.' })) }
}).listen(port, host, () => {
  process.stdout.write(`NTP gateway: http://${host}:${port}/api/time\n`)
})
