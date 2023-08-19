import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Image,
  Box,
  ScrollView,
  useToast,
} from 'native-base'

import { AppError } from '@utils/AppError'

import { api } from '@services/api'

import { ExerciseDTO } from '@dtos/ExerciseDTO'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'

import { Button } from '@components/Button'
import { Loading } from '@components/Loading'

type RouteParams = {
  exerciseId: string
}

export function Exercise() {
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const route = useRoute()
  const { exerciseId } = route.params as RouteParams

  const toast = useToast()

  async function fetchExerciseDetails() {
    setIsLoading(true)

    try {
      const response = await api.get(`/exercises/${exerciseId}`)

      setExercise(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Falha ao carregar os detalhes do exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleGoBack() {
    navigation.goBack()
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])

  return (
    <VStack flex={1}>
      <VStack bg="gray.600" px={8} pt={12}>
        <TouchableOpacity accessibilityLabel="Voltar" onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt={4}
          mb={8}
        >
          <Heading
            color="gray.100"
            fontSize="lg"
            fontFamily="heading"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="gray.200" textTransform="capitalize" ml={1}>
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView>
          <VStack p={8}>
            <Box rounded="lg" overflow="hidden" mb={3}>
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                }}
                alt={`Demonstração do exercício ${exercise.name}`}
                w="full"
                h={80}
                resizeMode="cover"
              />
            </Box>

            <Box bg="gray.600" rounded="md" pb={4} px={4}>
              <HStack alignItems="center" justifyContent="center" mb={6} mt={5}>
                <HStack alignItems="center">
                  <SeriesSvg />
                  <Text color="gray.200" ml={2}>
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack alignItems="center" ml={10}>
                  <RepetitionsSvg />
                  <Text color="gray.200" ml={2}>
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button title="Marcar como realizado" />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  )
}
