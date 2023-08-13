import { useTheme, Box } from 'native-base'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { useAuth } from '@hooks/useAuth'

import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'

export function Routes() {
  const { user } = useAuth()
  const { colors } = useTheme()

  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  const isUserAuthenticated = !!user.id

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {isUserAuthenticated ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
