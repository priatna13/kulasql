import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function errorMessage(body: unknown, fallback: string): string {
  if (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof body.error === 'string' &&
    body.error.trim()
  ) {
    return body.error
  }
  return fallback
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...init?.headers,
    },
  })
  let body: unknown = null
  try {
    body = await response.json()
  } catch {
    body = null
  }
  if (!response.ok) {
    throw new ApiError(response.status, errorMessage(body, 'Ada yang macet. Coba lagi.'))
  }
  return body as T
}

export type AuthUser = {
  id: string
  email: string
}

export type Progress = {
  xp: number
  level: number
  completions: { slug: string; xpGranted: number; completedAt: string }[]
}

export const EMPTY_PROGRESS: Progress = { xp: 0, level: 1, completions: [] }

type SessionResponse = {
  ok: true
  user: AuthUser
  progress: Progress
}

type CompleteResponse = {
  ok: true
  awarded: number
  progress: Progress
}

export type RegisterInput = {
  email: string
  password: string
  birthDate: string
  tosAccepted: boolean
}

type AuthValue = {
  ready: boolean
  user: AuthUser | null
  progress: Progress
  authOpen: boolean
  openAuth: () => void
  closeAuth: () => void
  register: (input: RegisterInput) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  recordPass: (slug: string) => Promise<number>
  authorized: <T>(path: string, init?: RequestInit) => Promise<T>
}

const AuthContext = createContext<AuthValue | null>(null)

function hasSession(value: SessionResponse | null): value is SessionResponse {
  return Boolean(value?.user?.email && value.progress && Array.isArray(value.progress.completions))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS)
  const [authOpen, setAuthOpen] = useState(false)
  const generation = useRef(0)

  useEffect(() => {
    const current = generation.current
    api<SessionResponse>('/api/auth/me')
      .then((data) => {
        if (generation.current !== current || !hasSession(data)) return
        setUser(data.user)
        setProgress(data.progress)
      })
      .catch(() => {
        // Bootstrap did not establish this session, so a late error must not clear it.
      })
      .finally(() => {
        if (generation.current === current) setReady(true)
      })
    return () => {
      generation.current += 1
    }
  }, [])

  function storeUser(data: SessionResponse) {
    generation.current += 1
    setUser(data.user)
    setProgress(data.progress)
    setAuthOpen(false)
    setReady(true)
  }

  async function register(input: RegisterInput) {
    const data = await api<SessionResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    if (!hasSession(data)) throw new ApiError(500, 'Jawaban server tidak lengkap.')
    storeUser(data)
  }

  async function login(email: string, password: string) {
    const data = await api<SessionResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (!hasSession(data)) throw new ApiError(500, 'Jawaban server tidak lengkap.')
    storeUser(data)
  }

  async function logout() {
    generation.current += 1
    try {
      await api('/api/auth/logout', { method: 'POST', body: '{}' })
    } finally {
      setUser(null)
      setProgress(EMPTY_PROGRESS)
      setAuthOpen(false)
      setReady(true)
    }
  }

  const dropSession = useCallback(() => {
    generation.current += 1
    setUser(null)
    setProgress(EMPTY_PROGRESS)
    setAuthOpen(true)
    setReady(true)
  }, [])

  const authorized = useCallback(async function authorized<T>(path: string, init?: RequestInit): Promise<T> {
    const current = generation.current
    try {
      return await api<T>(path, init)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401 && generation.current === current) dropSession()
      throw error
    }
  }, [dropSession])

  async function recordPass(slug: string): Promise<number> {
    const current = generation.current
    try {
      const saved = await api<CompleteResponse>('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ slug }),
      })
      if (!saved.progress || typeof saved.awarded !== 'number') {
        throw new ApiError(500, 'Jawaban server tidak lengkap.')
      }
      if (generation.current !== current) throw new Error('Sesi berubah. Kirim lagi.')
      setProgress(saved.progress)
      return saved.awarded
    } catch (error) {
      if (error instanceof ApiError && error.status === 401 && generation.current === current) dropSession()
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ready,
        user,
        progress,
        authOpen,
        openAuth: () => setAuthOpen(true),
        closeAuth: () => setAuthOpen(false),
        register,
        login,
        logout,
        recordPass,
        authorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('Sesi belum siap.')
  return value
}
