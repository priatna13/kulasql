import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL belum diisi.')
}

export const pool = new Pool({ connectionString, max: 5 })

// An idle socket errors when Neon suspends. No listener kills the process, and the client on that event carries the password.
pool.on('error', (err) => {
  const message = err instanceof Error ? err.message : 'db pool'
  console.error('db pool', message.replace(/postgres(?:ql)?:\/\/\S+/gi, 'postgresql://redacted'))
})

export const db = drizzle(pool, { schema })
