import AsyncStorage from '@react-native-async-storage/async-storage'

import { UserDTO } from '@dtos/UserDTO'
import { USER_STORAGE } from './configStorage'

export async function saveUserStorage(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
}

export async function getUserStorage() {
  const userStored = await AsyncStorage.getItem(USER_STORAGE)

  const user: UserDTO = userStored ? JSON.parse(userStored) : {}

  return user
}
