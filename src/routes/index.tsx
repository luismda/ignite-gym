import { useTheme, Box } from 'native-base'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { useAuth } from '@hooks/useAuth'

import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'

import { Loading } from '@components/Loading'

const linking = {
  prefixes: ['com.luismda.ignitegym://'],
  config: {
    screens: {
      signUp: {
        path: 'signUp',
      },
      history: {
        path: 'history',
      },
      exercise: {
        path: 'exercise/:exerciseId',
        parse: {
          exerciseId: (exerciseId: string) => exerciseId,
        },
      },
    },
  },
}

export function Routes() {
  const { user, isUserStorageDataLoading } = useAuth()
  const { colors } = useTheme()

  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  const isUserAuthenticated = !!user.id

  if (isUserStorageDataLoading) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer linking={linking} theme={theme}>
        {isUserAuthenticated ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
