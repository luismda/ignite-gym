import {
  ReactNode,
  createContext,
  useEffect,
  useCallback,
  useState,
} from 'react'

import { UserDTO } from '@dtos/UserDTO'
import { UserAuthTokenDTO } from '@dtos/UserAuthTokenDTO'

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

interface SaveUserDataStorageProps extends UserAuthTokenDTO {
  userData: UserDTO
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isUserStorageDataLoading, setIsUserStorageDataLoading] = useState(true)

  function saveApiAuthorizationToken(token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  async function saveUserDataStorage({
    userData,
    accessToken,
    refreshToken,
  }: SaveUserDataStorageProps) {
    setIsUserStorageDataLoading(true)

    try {
      await saveUserStorage(userData)

      await saveAuthTokenStorage({
        accessToken,
        refreshToken,
      })
    } finally {
      setIsUserStorageDataLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    const { data } = await api.post('/sessions', {
      email,
      password,
    })

    const {
      user: userAuthenticated,
      token: accessToken,
      refresh_token: refreshToken,
    } = data

    if (userAuthenticated && accessToken && refreshToken) {
      setUser(userAuthenticated)
      saveApiAuthorizationToken(accessToken)

      saveUserDataStorage({
        userData: userAuthenticated,
        accessToken,
        refreshToken,
      })
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

  const loadUserData = useCallback(async () => {
    setIsUserStorageDataLoading(true)

    try {
      const userLogged = await getUserStorage()
      const { accessToken } = await getAuthTokenStorage()

      if (userLogged.id && accessToken) {
        setUser(userLogged)
        saveApiAuthorizationToken(accessToken)
      }
    } finally {
      setIsUserStorageDataLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
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
