import axios from 'axios'
import { useState, useEffect } from 'react'
import { URL } from '../constants'

const useRetrieveCustomerPaymentMethod = (paymentMethodId) => {
  const [customerPaymentMethod, setCustomerPaymentMethod] = useState(null)

  
  useEffect(() => {
    if (!paymentMethodId) return
    async function fetchRetrieve() {
      try {
        const { data } = await axios.post(`${URL}/stripe/retrieve-customer-payment-method`, {
          paymentMethodId,
        })
        const paymentMethod = data.card.brand + ' •••• ' + data.card.last4
        setCustomerPaymentMethod(paymentMethod)
      } catch (error) {
        console.log('[RETRIEVE_CUSTOMER_PAYMENT_METHOD]')
        console.log({ error })
        throw new Error(error.message)
      }
    }

    fetchRetrieve()
  }, [paymentMethodId])

  return customerPaymentMethod
}

export default useRetrieveCustomerPaymentMethod
