import axios from 'axios'
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
        const { data } = await axios.get(`${URL}/auth/me`, {
          headers: {
            'x-access-token': String(token),
          },
        })

        setUserInfo({ ...data })
        console.log(userInfo)

        // setLoadingUser(false)
        // setIsAuth(true)
        // setUserLoaded(true)
      } catch (err) {
        console.log(err)
      }
    }

    loadUser()
  }, [isAuth, userInfo, userLoaded])

  return {
    loadingUser,
    userInfo,
    isAuth,
    setIsAuth,
  }
}

export default useLogin