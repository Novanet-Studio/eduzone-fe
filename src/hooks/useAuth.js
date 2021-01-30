import axios from 'axios'
import { useEffect, useState } from 'react'
import Auth from '../helpers/auth'
import { URL } from '../constants'

const useAuth = () => {
  const [user, setUser] = useState({})

  useEffect(() => {

    if (user.auth) return

    const loadUser = async () => {
      const token = Auth.getToken

      if (!token) return

      try {
        const { data } = await axios.get(`${URL}/auth/me`)
        setUser(data)
        localStorage.setItem('auth', data.auth)
      } catch (error) {
        console.log(error.message)
      }
    }

    loadUser()

  }, [user])

  return user
}

export default useAuth
