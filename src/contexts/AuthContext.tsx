import { ReactNode, createContext, useEffect, useState } from 'react'

import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'

import {
  getUserStorage,
  saveUserStorage,
  removeUserStorage,
} from '@storage/userStorage'

import {
  getAuthTokenStorage,
  removeAuthTokenStorage,
  saveAuthTokenStorage,
} from '@storage/authTokenStorage'

interface AuthContextData {
  user: UserDTO
  isUserStorageDataLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (updatedUser: UserDTO) => Promise<void>
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isUserStorageDataLoading, setIsUserStorageDataLoading] = useState(true)

  function saveApiAuthorizationToken(token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  async function saveUserDataStorage(userData: UserDTO, token: string) {
    setIsUserStorageDataLoading(true)

    try {
      await saveUserStorage(userData)
      await saveAuthTokenStorage(token)
    } finally {
      setIsUserStorageDataLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    const { data } = await api.post<{ user: UserDTO; token: string }>(
      '/sessions',
      {
        email,
        password,
      },
    )

    const userAuthenticated = data.user
    const userToken = data.token

    if (userAuthenticated && userToken) {
      setUser(userAuthenticated)
      saveApiAuthorizationToken(userToken)
      saveUserDataStorage(userAuthenticated, userToken)
    }
  }

  async function signOut() {
    setIsUserStorageDataLoading(true)

    try {
      setUser({} as UserDTO)

      await removeUserStorage()
      await removeAuthTokenStorage()
    } finally {
      setIsUserStorageDataLoading(false)
    }
  }

  async function updateUserProfile(updatedUser: UserDTO) {
    setUser(updatedUser)
    await saveUserStorage(updatedUser)
  }

  async function loadUserData() {
    setIsUserStorageDataLoading(true)

    try {
      const userLogged = await getUserStorage()
      const token = await getAuthTokenStorage()

      if (userLogged.id && token) {
        setUser(userLogged)
        saveApiAuthorizationToken(token)
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
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
