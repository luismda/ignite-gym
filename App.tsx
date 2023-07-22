import { StatusBar } from 'react-native'
import { NativeBaseProvider } from 'native-base'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { THEME } from '@theme/index'

import { Routes } from '@routes/index'
import { Loading } from '@components/Loading'

export default function App() {
  const [hasLoadedFonts] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {hasLoadedFonts ? <Routes /> : <Loading />}
    </NativeBaseProvider>
  )
}
