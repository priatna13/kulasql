import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function loadEnv(): void {
  const path = resolve(dirname(fileURLToPath(import.meta.url)), '../.env')
  if (!existsSync(path)) return
  process.loadEnvFile(path)
}

loadEnv()
