import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './routes/auth.ts'
import { health } from './routes/health.ts'
import { lesson } from './routes/lesson.ts'
import { progress } from './routes/progress.ts'
import { waitlist } from './routes/waitlist.ts'

export const app = new Hono()

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    credentials: true,
  }),
)

app.route('/api', health)
app.route('/api', auth)
app.route('/api', progress)
app.route('/api', lesson)
app.route('/api', waitlist)

const staticRoot = fileURLToPath(new URL('../../frontend/dist', import.meta.url))
if (existsSync(staticRoot)) {
  app.use('*', async (c, next) => {
    if (c.req.path.startsWith('/api')) return next()
    return serveStatic({ root: staticRoot })(c, next)
  })
}

app.notFound((c) => {
  const index = join(staticRoot, 'index.html')
  if (c.req.method === 'GET' && !c.req.path.startsWith('/api') && existsSync(index)) {
    return c.html(readFileSync(index, 'utf8'))
  }
  return c.json({ ok: false, error: 'not_found' }, 404)
})

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('code' in error)) return undefined
  return typeof error.code === 'string' ? error.code : undefined
}

app.onError((err, c) => {
  const name = err instanceof Error ? err.name : 'Error'
  const causeCode = err instanceof Error ? errorCode(err.cause) : undefined
  const logged = [name, errorCode(err), causeCode].filter(Boolean).join(' ')
  console.error('api error', logged.replace(/postgres(?:ql)?:\/\/\S+/gi, 'postgresql://redacted'))
  return c.json({ ok: false, error: 'Ada yang macet. Coba lagi.' }, 500)
})
