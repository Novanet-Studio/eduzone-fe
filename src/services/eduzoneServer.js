import axios from 'axios'
import { URL } from '../constants'
import { setAccount, setToken, setUserSession } from '../utils/common'

export const checkUserExists = async (email) => {
  if (typeof email !== 'string') throw new Error('Incorrect email provided')

  try {
    const { data } = await axios.post(`${URL}/user/verify`, { email })
    return data.exists
  } catch (error) {
    console.log('[CHECK_USER_EXISTS]')
    console.error({ error })
    throw new Error(error.message)
  }
}

export const createCustomer = async (email) => {
  if (typeof email !== 'string') throw new Error('Incorrect email provided')

  try {
    const { data } = await axios.post(`${URL}/stripe/create-customer`, {
      email,
    })
    return data
  } catch (error) {
    console.log('[CREATE_CUSTOMER_HELPER]')
    console.error(error.message)
    throw new Error(error.message)
  }
}

export const createUser = async ({
  firstname,
  lastname,
  userName,
  password,
  type,
}) => {
  const bodyParams = {
    firstname,
    lastname,
    userName,
    password,
    type,
  }

  console.log('[BODY_PARAMS]')
  console.log(bodyParams)

  try {
    const { data } = await axios.post(`${URL}/auth/signup`, bodyParams)

    if (!data.auth) {
      console.log('Cannot register user')
      throw new Error('Cannot register user')
    }

    setToken(data.token)

    const { data: me } = await axios.get(`${URL}/auth/me`)
    const { priceId, paymentMethodId, subscription, user } = me

    setUserSession(user)
    setAccount({
      priceId,
      paymentMethodId,
      subscription,
    })
    return { success: true, accountInformation: me }
  } catch (error) {
    throw error
  }
}
