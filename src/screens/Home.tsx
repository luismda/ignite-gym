import { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { VStack, FlatList, HStack, Heading, Text, useToast } from 'native-base'

import { AppError } from '@utils/AppError'

import { api } from '@services/api'

import { ExerciseDTO } from '@dtos/ExerciseDTO'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { Group } from '@components/Group'
import { Loading } from '@components/Loading'
import { HomeHeader } from '@components/HomeHeader'
import { ExerciseCard } from '@components/ExerciseCard'

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const toast = useToast()

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleNavigateToExercise(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId })
  }

  const fetchGroups = useCallback(async () => {
    try {
      const response = await api.get('/groups')
      const groupsResponse = response.data

      setGroups(groupsResponse)
      setSelectedGroup(groupsResponse[0])
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Falha ao carregar os grupos musculares.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }, [toast])

  const fetchExercisesByGroup = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await api.get(`/exercises/bygroup/${selectedGroup}`)

      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Falha ao carregar os exercícios.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }, [selectedGroup, toast])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [fetchExercisesByGroup]),
  )

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isSelected={item === selectedGroup}
            onPressIn={() => setSelectedGroup(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack justifyContent="space-between" alignItems="center" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                data={item}
                onPress={() => handleNavigateToExercise(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{
              paddingBottom: 20,
            }}
          />
        </VStack>
      )}
    </VStack>
  )
}
