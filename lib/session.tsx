'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type SessionCtx = { loggedIn: boolean; login: () => void; logout: () => void }
const Ctx = createContext<SessionCtx>({ loggedIn: false, login: () => {}, logout: () => {} })

export function SessionProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(localStorage.getItem('mentora-session') === '1')
  }, [])

  const login = () => { localStorage.setItem('mentora-session', '1'); setLoggedIn(true) }
  const logout = () => { localStorage.removeItem('mentora-session'); setLoggedIn(false) }

  return <Ctx.Provider value={{ loggedIn, login, logout }}>{children}</Ctx.Provider>
}

export const useSession = () => useContext(Ctx)
