import axios from 'axios'
import { URL } from '../utils'

export const checkUserExists = async (email) => {
  try {
    const { data } = await axios.post(`${URL}/user/verify`, { email })

    return data.exists
  } catch (error) {
    console.log('[CHECK_USER_EXISTS]')
    console.error(error.message)
    throw new Error(error.message)
  }
}

export const createCustomer = async (email) => {
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
