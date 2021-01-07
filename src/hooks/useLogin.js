import { useState, useEffect } from 'react'
import { Auth, URL } from '../utils';

const useLogin = () => {
  const [loadingUser, setLoadingUser] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [userLoaded, setUserLoaded] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    console.log('Loading user again ...')

    if (isAuth) return null

    async function loadUser() {
      const token = Auth.getToken
      if (!token) {
        setLoadingUser(false)
        console.log('exit')
        return
      }

      if (userLoaded) {
        setUserLoaded(false)
        console.log('Is loaded')
        return
      }

      try {
        const response = await fetch(`${URL}/api/auth/me`, {
          headers: {
            'x-access-token': String(token),
          },
        })
        const result = await response.json()

        setUserInfo({ ...result })
        console.log(userInfo)

        // setLoadingUser(false)
        // setIsAuth(true)
        // setUserLoaded(true)
      } catch (err) {
        console.log(err)
      }
    }

    loadUser()
  }, [isAuth])

  return {
    loadingUser,
    userInfo,
    isAuth,
    setIsAuth,
  }
}

export default useLogin