import { ReactNode, createContext, useEffect, useState } from 'react'

import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'

import { getUserStorage, saveUserStorage } from '@storage/userStorage'

interface AuthContextData {
  user: UserDTO
  isUserStorageDataLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isUserStorageDataLoading, setIsUserStorageDataLoading] = useState(true)

  async function signIn(email: string, password: string) {
    const response = await api.post<{ user: UserDTO }>('/sessions', {
      email,
      password,
    })

    const userAuthenticated = response.data.user

    if (userAuthenticated) {
      setUser(userAuthenticated)
      saveUserStorage(userAuthenticated)
    }
  }

  async function loadUserData() {
    setIsUserStorageDataLoading(true)

    try {
      const userLogged = await getUserStorage()

      if (userLogged.id) {
        setUser(userLogged)
      }
    } finally {
      setIsUserStorageDataLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isUserStorageDataLoading,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
