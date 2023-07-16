import { Text, View, StatusBar } from 'react-native'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

export default function App() {
  const [hasLoadedFonts] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <View
      style={{
        backgroundColor: '#202024',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {hasLoadedFonts ? <Text>Hello!</Text> : <View />}
    </View>
  )
}
