import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

const KEY_LEN = 64

function scryptKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LEN, (error, derived) => {
      if (error) reject(error)
      else resolve(derived)
    })
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const key = await scryptKey(password, salt)
  return `scrypt$${salt.toString('base64url')}$${key.toString('base64url')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltPart, keyPart] = stored.split('$')
  if (scheme !== 'scrypt' || !saltPart || !keyPart) return false
  const salt = Buffer.from(saltPart, 'base64url')
  const expected = Buffer.from(keyPart, 'base64url')
  if (expected.length === 0 || salt.length === 0) return false
  const actual = await scryptKey(password, salt)
  if (actual.length !== expected.length) return false
  return timingSafeEqual(actual, expected)
}
