import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  getToken,
  setAccount,
  setUserSession,
  setUserLicense,
  removeUserSession,
} from '@/utils/common'
import { URL } from '@/constants'

const useLoadData = (history) => {
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const isPolicyPath = history.location.pathname.includes('/policy')

    const loadUser = async () => {
      const token = getToken()

      if (!token) {
        return
      }

      try {
        const {
          data: { priceId, paymentMethodId, subscription, user, license },
        } = await axios.get(`${URL}/auth/me`)
        setAccount({ priceId, paymentMethodId, subscription })
        setUserSession(user)
        setUserLicense(license)
        setTimeout(
          () =>
            isPolicyPath ? history.push('/policy') : history.push('/account'),
          200,
        )
        setAuthLoading(false)
      } catch (error) {
        removeUserSession()
        setAuthLoading(false)
      }
    }

    loadUser()
  }, [history])

  return authLoading
}

export default useLoadData
