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
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Button } from '@components/Button'
import { Input } from '@components/Input'

const PHOTO_SIZE = 33
const UPLOAD_PHOTO_MAX_MB_SIZE = 5

export function Profile() {
  const [hasPhotoLoaded, setHasPhotoLoaded] = useState(true)
  const [userPhoto, setUserPhoto] = useState('https://github.com/luismda.png')

  const toast = useToast()

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

          <Input bg="gray.600" placeholder="Nome" />

          <Input bg="gray.600" placeholder="E-mail" isDisabled />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mt={12} mb={2}>
            Alterar senha
          </Heading>

          <Input bg="gray.600" placeholder="Senha atual" secureTextEntry />

          <Input bg="gray.600" placeholder="Nova senha" secureTextEntry />

          <Input
            bg="gray.600"
            placeholder="Confirme a nova senha"
            secureTextEntry
          />

          <Button title="Atualizar" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  )
}
