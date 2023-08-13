import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import {
  Center,
  Heading,
  Image,
  Text,
  VStack,
  ScrollView,
  useToast,
} from 'native-base'
import { z } from 'zod'

import LogoSvg from '@assets/logo.svg'
import backgroundImg from '@assets/background.png'

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { AppError } from '@utils/AppError'

import { useAuth } from '@hooks/useAuth'

import { Input } from '@components/Input'
import { Button } from '@components/Button'

const signInFormSchema = z.object({
  email: z
    .string({ required_error: 'Informe o seu e-mail.' })
    .email('Informe um e-mail válido.'),
  password: z.string({ required_error: 'Informe a sua senha.' }).trim(),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export function SignIn() {
  const { signIn } = useAuth()

  const toast = useToast()

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
  })

  async function handleSignIn({ email, password }: SignInFormData) {
    try {
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Falha ao acessar. Tente novamente.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

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
          <Heading color="gray.100" fontSize="xl" fontFamily="heading" mb={6}>
            Acesse sua conta
          </Heading>

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={errors.email?.message}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                errorMessage={errors.password?.message}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Button
            title="Acessar"
            isLoading={isSubmitting}
            onPress={handleSubmit(handleSignIn)}
          />
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
