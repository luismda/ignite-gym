import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
  useTheme,
} from 'native-base'

interface InputProps extends IInputProps {
  errorMessage?: string | null
}

export function Input({ errorMessage = null, isInvalid, ...rest }: InputProps) {
  const { colors } = useTheme()

  const isInvalidInput = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={isInvalidInput} mb={4}>
      <NativeBaseInput
        bg="gray.700"
        h={14}
        w="full"
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        cursorColor={colors.green[500]}
        placeholderTextColor="gray.300"
        isInvalid={isInvalidInput}
        _invalid={{
          borderWidth: 1,
          borderColor: 'red.500',
        }}
        _focus={
          isInvalidInput
            ? {
                borderWidth: 1,
                borderColor: 'red.500',
              }
            : {
                bg: 'gray.700',
                borderWidth: 1,
                borderColor: 'green.500',
              }
        }
        _disabled={{
          bg: 'gray.600',
          opacity: 0.5,
        }}
        {...rest}
      />

      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
