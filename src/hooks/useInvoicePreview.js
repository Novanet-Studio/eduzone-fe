import axios from 'axios'
import { useEffect, useState } from 'react'
import { URL } from '@constants'

const useInvoicePreview = ({
  customerId,
  subscriptionId,
  newProductSelected
}) => {
  const [invoicePreview, setInvoicePreview] = useState({})

  useEffect(() => {
    const fetchInvoice = async () => {
      const bodyParams = {
        newPriceId: newProductSelected.toUpperCase(),
        customerId,
        subscriptionId,
      }
      const { data } = await axios.post(
        `${URL}/stripe/retrieve-upcoming-invoice`,
        bodyParams,
      )
      setInvoicePreview(data)
    }

    fetchInvoice()
  }, [customerId, subscriptionId, newProductSelected])

  return invoicePreview
}

export default useInvoicePreview
