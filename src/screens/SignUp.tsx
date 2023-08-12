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
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import LogoSvg from '@assets/logo.svg'
import backgroundImg from '@assets/background.png'

import { api } from '@services/api'

import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { AppError } from '@utils/AppError'

const signUpFormSchema = z
  .object({
    name: z
      .string({ required_error: 'Informe o seu nome.' })
      .trim()
      .nonempty('Informe o seu nome.'),
    email: z
      .string({ required_error: 'Informe um e-mail.' })
      .email('Informe um e-mail válido.'),
    password: z
      .string({ required_error: 'Informe uma senha.' })
      .trim()
      .min(6, 'A senha deve ter um mínimo de 6 dígitos.'),
    confirmPassword: z
      .string({ required_error: 'Confirme a senha.' })
      .trim()
      .nonempty('Confirme a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'A confirmação da senha não corresponde.',
  })

type SignUpFormData = z.infer<typeof signUpFormSchema>

export function SignUp() {
  const navigation = useNavigation()

  const toast = useToast()

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  })

  async function handleSignUp({ name, email, password }: SignUpFormData) {
    try {
      const response = await api.post('/users', {
        name,
        email,
        password,
      })

      console.log(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Falha ao criar sua conta. Tente novamente.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  function handleGoBack() {
    navigation.goBack()
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

        <Center mt={24} mb={40}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" fontFamily="heading" mb={6}>
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Nome"
                errorMessage={errors.name?.message}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Confirmar senha"
                returnKeyType="send"
                secureTextEntry
                errorMessage={errors.confirmPassword?.message}
                value={value}
                onChangeText={onChange}
                onSubmitEditing={handleSubmit(handleSignUp)}
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
          />
        </Center>

        <Button
          title="Voltar para o login"
          variant="outline"
          mt={16}
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  )
}
