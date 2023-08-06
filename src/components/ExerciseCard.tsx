import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { HStack, Heading, Image, Text, VStack, Icon } from 'native-base'
import { Entypo } from '@expo/vector-icons'

type ExerciseCardProps = TouchableOpacityProps

export function ExerciseCard(props: ExerciseCardProps) {
  return (
    <TouchableOpacity {...props}>
      <HStack
        bg="gray.500"
        alignItems="center"
        rounded="md"
        p={2}
        pr={4}
        mb={3}
      >
        <Image
          source={{
            uri: 'https://williamcarvalhoamaral.files.wordpress.com/2020/01/dorsal-blog.jpg',
          }}
          alt="Mulher executando o exercício de puxada frontal"
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading color="white" fontSize="lg" fontFamily="heading">
            Puxada frontal
          </Heading>

          <Text color="gray.200" fontSize="sm" mt={1} numberOfLines={2}>
            3 séries x 12 repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" color="gray.300" size={6} />
      </HStack>
    </TouchableOpacity>
  )
}
