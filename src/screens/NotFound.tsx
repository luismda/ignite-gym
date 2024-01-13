import { Center, Text } from 'native-base'
import { useNavigation } from '@react-navigation/native'

import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { useAuth } from '@hooks/useAuth'

import { Button } from '@components/Button'

type NavigatorRoutes = AppNavigatorRoutesProps & AuthNavigatorRoutesProps

export function NotFound() {
  const { user } = useAuth()
  const navigation = useNavigation<NavigatorRoutes>()

  const isUserAuthenticated = !!user.id

  function handleGoBack() {
    if (isUserAuthenticated) {
      navigation.navigate('home')
      return
    }

    navigation.navigate('signIn')
  }

  return (
    <Center flex={1} p={8}>
      <Text fontSize="2xl" fontFamily="heading" color="gray.100">
        Ops...
      </Text>

      <Text mt={2} textAlign="center" fontSize="md" color="gray.100">
        Nada encontrado por aqui, parece que você chegou ao fim!
      </Text>

      <Button title="Voltar ao início" mt={8} onPress={handleGoBack} />
    </Center>
  )
}
