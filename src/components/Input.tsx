import { Input as NativeBaseInput, IInputProps, useTheme } from 'native-base'

type InputProps = IInputProps

export function Input(props: InputProps) {
  const { colors } = useTheme()

  return (
    <NativeBaseInput
      bg="gray.700"
      h={14}
      w="full"
      px={4}
      mb={4}
      borderWidth={0}
      fontSize="md"
      color="white"
      fontFamily="body"
      placeholderTextColor="gray.300"
      cursorColor={colors.green[500]}
      _focus={{
        bg: 'gray.700',
        borderWidth: 1,
        borderColor: 'green.500',
      }}
      _disabled={{
        bg: 'gray.600',
        opacity: 0.5,
      }}
      {...props}
    />
  )
}
