import axios from 'axios'
import { useContext, useState, createContext, useEffect, useMemo, useCallback } from 'react'
import { Auth } from '../utils'

const GlobalContext = createContext()

const initialFormState = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
}

export const GlobalProvider = (props) => {
  const [formState, setFormState] = useState(initialFormState)
  const [userData, setUserData] = useState(null)
  const [loadingUser, setLoadingUser] = useState(false)

  useEffect(() => {
    async function loadUser() {
      if (!Auth.getToken) {
        setLoadingUser(false)
        return
      }

      try {
        const { data: user } = await axios.get(
          'http://localhost:3000/auth/me',
          {
            headers: {
              'x-access-token': Auth.getToken,
            },
          },
        )
        setUserData(user)
        setLoadingUser(false)
      } catch (error) {
        console.log(error)
      }
    }

    loadUser()
  }, [])

  const setInitialFormState = () => setFormState(initialFormState)

  const updateFormState = useCallback((updated = {}) =>
    setFormState({
      ...formState,
      ...updated,
    }), [formState])

  const value = useMemo(
    () => ({
      userData,
      formState,
      loadingUser,
      setInitialFormState,
      updateFormState,
    }),
    [userData, formState, loadingUser, updateFormState],
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
