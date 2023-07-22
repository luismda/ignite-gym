import { useNavigation } from '@react-navigation/native'
import { Center, Heading, Image, Text, VStack, ScrollView } from 'native-base'

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import LogoSvg from '@assets/logo.svg'
import backgroundImg from '@assets/background.png'

import { Input } from '@components/Input'
import { Button } from '@components/Button'

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNavigateToSignUp() {
    navigation.navigate('signUp')
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={backgroundImg}
          defaultSource={backgroundImg}
          alt="Uma mulher e um homem treinando em uma academia."
          resizeMode="contain"
          position="absolute"
        />

        <Center mt={24} mb={48}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Acesse sua conta
          </Heading>

          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input placeholder="Senha" secureTextEntry />

          <Button title="Acessar" />
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar conta"
            variant="outline"
            onPress={handleNavigateToSignUp}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
