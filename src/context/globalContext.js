import {
  useContext,
  useState,
  createContext,
  useMemo,
  useCallback,
} from 'react'
import useChangeLocation from '../hooks/useChangeLocation'

const GlobalContext = createContext()

const initialFormState = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const GlobalProvider = (props) => {
  const [formState, setFormState] = useState(initialFormState)
  const [setIsTyping, changeLocation] = useChangeLocation(false)

  const setInitialFormState = useCallback(
    () => setFormState(initialFormState),
    [],
  )

  const updateFormState = useCallback(
    (updated = {}) =>
      setFormState({
        ...formState,
        ...updated,
      }),
    [formState],
  )

  const handleTypingChange = useCallback(
    ({ currentTarget: { name, value } }) => {
      setIsTyping(true)
      updateFormState({ [name]: value })
    },
    [setIsTyping, updateFormState],
  )

  const value = useMemo(
    () => ({
      formState,
      setIsTyping,
      changeLocation,
      updateFormState,
      handleTypingChange,
      setInitialFormState,
    }),
    [
      formState,
      setIsTyping,
      changeLocation,
      updateFormState,
      handleTypingChange,
      setInitialFormState,
    ],
  )

  return <GlobalContext.Provider value={value} {...props} />
}

export const useGlobal = () => {
  const context = useContext(GlobalContext)

  if (!context) {
    throw new Error('useGlobal must be within GlobalContext provide')
  }

  return context
}
