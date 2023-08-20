import AsyncStorage from '@react-native-async-storage/async-storage'

import { UserAuthTokenDTO } from '@dtos/UserAuthTokenDTO'

import { AUTH_TOKEN_STORAGE } from './configStorage'

export async function saveAuthTokenStorage({
  accessToken,
  refreshToken,
}: UserAuthTokenDTO) {
  await AsyncStorage.setItem(
    AUTH_TOKEN_STORAGE,
    JSON.stringify({ accessToken, refreshToken }),
  )
}

export async function getAuthTokenStorage() {
  const storedAuthToken = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE)

  const authToken: UserAuthTokenDTO = storedAuthToken
    ? JSON.parse(storedAuthToken)
    : {}

  return authToken
}

export async function removeAuthTokenStorage() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE)
}
