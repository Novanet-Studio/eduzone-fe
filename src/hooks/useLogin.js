import axios from 'axios'
import { useState, useEffect } from 'react'
import { URL } from '../constants'
import Auth from '../helpers/auth'

const useLogin = () => {
  const [loadingUser, setLoadingUser] = useState(true)
  const [userInfo, setUserInfo] = useState({})
  const [userLoaded, setUserLoaded] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    if (isAuth) return null

    console.log('Loading user again ...')
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
        const { data } = await axios.get(`${URL}/auth/me`)

        setUserInfo({ ...data })
        console.log(userInfo)

        setLoadingUser(false)
        setIsAuth(true)
        setUserLoaded(true)
      } catch (error) {
        console.log(error.message)
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
