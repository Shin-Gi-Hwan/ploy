import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, LoginRequest, RegisterRequest } from '../types/api'
import { loginUser, registerUser } from '../lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  loginWithToken: (token: string, user: User) => void
  logout: () => void
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const TOKEN_KEY = 'ploy_token'
const USER_KEY  = 'ploy_user'

function readStorage(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw   = localStorage.getItem(USER_KEY)
    const user  = raw ? (JSON.parse(raw) as User) : null
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

function writeStorage(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const { token, user } = readStorage()
    return {
      user,
      token,
      isAuthenticated: !!(token && user),
      isLoading: false,
    }
  })

  // Keep axios default header in sync with token
  useEffect(() => {
    // Dynamically set Authorization header on every request via api.ts interceptor
    // (handled in lib/api.ts — nothing to do here)
  }, [state.token])

  const login = useCallback(async (data: LoginRequest) => {
    setState(s => ({ ...s, isLoading: true }))
    try {
      const res = await loginUser(data)
      writeStorage(res.token, res.user)
      setState({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false })
    } catch (err) {
      setState(s => ({ ...s, isLoading: false }))
      throw err
    }
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    setState(s => ({ ...s, isLoading: true }))
    try {
      const res = await registerUser(data)
      writeStorage(res.token, res.user)
      setState({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false })
    } catch (err) {
      setState(s => ({ ...s, isLoading: false }))
      throw err
    }
  }, [])

  const loginWithToken = useCallback((token: string, user: User) => {
    writeStorage(token, user)
    setState({ user, token, isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(() => {
    clearStorage()
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
