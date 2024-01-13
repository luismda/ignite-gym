import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import { NotFound } from '@screens/NotFound'

type CommonRoutes = {
  notFound: undefined
}

export type CommonNavigatorRoutesProps = NativeStackNavigationProp<CommonRoutes>

const { Navigator, Screen } = createNativeStackNavigator<CommonRoutes>()

export function CommonRoutes() {
  return (
    <Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Screen name="notFound" component={NotFound} />
    </Navigator>
  )
}
