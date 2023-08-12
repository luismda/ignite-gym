import { ReactNode, createContext, useState } from 'react'

import { UserDTO } from '@dtos/UserDTO'

interface AuthContextData {
  user: UserDTO
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({
    id: '1',
    name: 'Luis Miguel',
    email: 'luismigueldutraalves@gmail.com',
    avatar: 'photo.png',
  })

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
