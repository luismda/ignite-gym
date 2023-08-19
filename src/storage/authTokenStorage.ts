import AsyncStorage from '@react-native-async-storage/async-storage'

import { AUTH_TOKEN_STORAGE } from './configStorage'

export async function saveAuthTokenStorage(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, token)
}

export async function getAuthTokenStorage() {
  const authToken = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE)

  return authToken
}

export async function removeAuthTokenStorage() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE)
}
