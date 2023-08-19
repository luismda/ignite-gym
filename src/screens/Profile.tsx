import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
  useToast,
} from 'native-base'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { z } from 'zod'

import { AppError } from '@utils/AppError'

import { api } from '@services/api'

import { useAuth } from '@hooks/useAuth'

import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Button } from '@components/Button'
import { Input } from '@components/Input'

const PHOTO_SIZE = 33
const UPLOAD_PHOTO_MAX_MB_SIZE = 5

const editProfileFormSchema = z
  .object({
    name: z
      .string({ required_error: 'Informe o seu nome.' })
      .trim()
      .nonempty('Informe o seu nome.'),
    email: z.string(),
    currentPassword: z
      .string()
      .trim()
      .optional()
      .transform((currentPassword) => currentPassword || undefined),
    newPassword: z
      .string()
      .trim()
      .optional()
      .transform((newPassword) => newPassword || undefined),
    confirmNewPassword: z
      .string()
      .trim()
      .optional()
      .transform((confirmNewPassword) => confirmNewPassword || undefined),
  })
  .refine(
    (data) => {
      const { currentPassword, newPassword, confirmNewPassword } = data

      if (currentPassword || newPassword || confirmNewPassword) {
        const currentPasswordSchema = z.string().nonempty()

        const validateCurrentPassword =
          currentPasswordSchema.safeParse(currentPassword)

        if (!validateCurrentPassword.success) {
          return false
        }
      }

      return true
    },
    {
      path: ['currentPassword'],
      message: 'Informe a senha atual corretamente.',
    },
  )
  .refine(
    (data) => {
      const { currentPassword, newPassword, confirmNewPassword } = data

      if (currentPassword || newPassword || confirmNewPassword) {
        const newPasswordSchema = z.string().trim().min(6)

        const validateNewPassword = newPasswordSchema.safeParse(newPassword)

        if (!validateNewPassword.success) {
          return false
        }
      }

      return true
    },
    {
      path: ['newPassword'],
      message: 'Informe a nova senha com o mínimo de 6 dígitos.',
    },
  )
  .refine(
    (data) => {
      const { currentPassword, newPassword, confirmNewPassword } = data

      if (currentPassword || newPassword || confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
          return false
        }
      }

      return true
    },
    {
      path: ['confirmNewPassword'],
      message: 'A confirmação da senha não corresponde.',
    },
  )

type EditProfileFormData = z.infer<typeof editProfileFormSchema>

export function Profile() {
  const [hasPhotoLoaded, setHasPhotoLoaded] = useState(true)
  const [userPhoto, setUserPhoto] = useState('https://github.com/luismda.png')

  const toast = useToast()

  const { user, updateUserProfile } = useAuth()

  const {
    control,
    formState: { errors, isSubmitting },
    resetField,
    handleSubmit,
  } = useForm<EditProfileFormData>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: zodResolver(editProfileFormSchema),
  })

  async function handleSelectUserPhoto() {
    setHasPhotoLoaded(false)

    try {
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (selectedPhoto.canceled) {
        return
      }

      const [photo] = selectedPhoto.assets

      if (photo.uri) {
        const photoInfo = await FileSystem.getInfoAsync(photo.uri)

        const photoSizeInBytes = photoInfo.exists ? photoInfo.size : 0
        const photoSizeInMegaBytes = photoSizeInBytes / 1024 / 1024

        if (photoSizeInMegaBytes > UPLOAD_PHOTO_MAX_MB_SIZE) {
          toast.show({
            title: `Foto muito grande! Escolha uma de até ${UPLOAD_PHOTO_MAX_MB_SIZE}MB.`,
            placement: 'top',
            bgColor: 'red.500',
          })

          return
        }

        setUserPhoto(photo.uri)
      }
    } catch (error) {
      toast.show({
        title: 'Ocorreu um erro ao alterar sua foto. Tente novamente.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setHasPhotoLoaded(true)
    }
  }

  async function handleSaveProfile(data: EditProfileFormData) {
    try {
      await api.put('/users', {
        name: data.name,
        password: data.newPassword,
        old_password: data.currentPassword,
      })

      await updateUserProfile({
        ...user,
        name: data.name,
      })

      resetField('currentPassword')
      resetField('newPassword')
      resetField('confirmNewPassword')

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.700',
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Falha ao atualizar seu perfil.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          <Skeleton
            w={PHOTO_SIZE}
            h={PHOTO_SIZE}
            rounded="full"
            startColor="gray.600"
            endColor="gray.400"
            isLoaded={hasPhotoLoaded}
          >
            <UserPhoto
              source={{ uri: userPhoto }}
              alt="Luís Miguel"
              size={33}
            />
          </Skeleton>

          <TouchableOpacity onPress={handleSelectUserPhoto}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
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
            render={({ field: { value } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                value={value}
                isDisabled
              />
            )}
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading
            color="gray.200"
            fontSize="md"
            fontFamily="heading"
            mt={12}
            mb={2}
          >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha atual"
                errorMessage={errors.currentPassword?.message}
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                errorMessage={errors.newPassword?.message}
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />

          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                errorMessage={errors.confirmNewPassword?.message}
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            isLoading={isSubmitting}
            onPress={handleSubmit(handleSaveProfile)}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}
