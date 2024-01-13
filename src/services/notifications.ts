import { Platform } from 'react-native'
import OneSignal from 'react-native-onesignal'

const appId =
  Platform.OS === 'android'
    ? process.env.EXPO_PUBLIC_ONE_SIGNAL_ANDROID_APP_ID
    : undefined

if (!appId) {
  throw new Error('OneSignal App ID is missing.')
}

OneSignal.setAppId(appId)

export function createUserEmailNotificationTag(email: string) {
  OneSignal.sendTag('user_email', email)
}

export function createUserLastExerciseDateNotificationTag() {
  const lastExerciseDate = new Date().toISOString()
  OneSignal.sendTag('user_last_exercise_date', lastExerciseDate)
}
