import { ReactNode, createContext, useState } from 'react'

import { UserDTO } from '@dtos/UserDTO'
import { api } from '@services/api'

interface AuthContextData {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function signIn(email: string, password: string) {
    const response = await api.post<{ user: UserDTO }>('/sessions', {
      email,
      password,
    })

    if (response.data.user) {
      setUser(response.data.user)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
