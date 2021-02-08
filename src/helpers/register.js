import axios from 'axios'
import { URL } from '../constants'

export const checkUserExists = async (email) => {
  if (typeof email !== 'string') throw new Error('Incorrect email provided')
  
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
  if (typeof email !== 'string') throw new Error('Incorrect email provided')

  try {
    const { data } = await axios.post(`${URL}/stripe/create-customer`, { email })
    return data
  } catch (error) {
    console.log('[CREATEA_CUSTOMER_HELPER]')
    console.error(error.message)
    throw new Error(error.message)
  }
}
