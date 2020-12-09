import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import {
  apiRequest,
  getDateStringFromUnixTimestamp,
  getFormattedAmount,
  URL
} from '../utils'

function PriceChangeForm({
  customerId,
  subscriptionId,
  currentProductSelected,
  newProductSelected,
  setShowChangePriceForm,
  setSelectedProduct,
}) {
  let [invoicePreview, setInvoicePreview] = useState({})

  useEffect(() => {
    async function fetchData() {
      const bodyParams = {
        newPriceId: newProductSelected.toUpperCase(),
        customerId,
        subscriptionId,
      }
      const result = await apiRequest(
        `${URL}/stripe/retrieve-upcoming-invoice`,
        'POST',
        bodyParams,
      )
      console.log(result)
      setInvoicePreview(result)
    }
    fetchData()
  }, [customerId, subscriptionId, newProductSelected])

  console.log(invoicePreview)

  async function confirmPriceChange() {
    const bodyParams = {
      newPriceId: newProductSelected.toUpperCase(),
      subscriptionId,
    }
    const result = await apiRequest(
      `${URL}/stripe/update-subscription`,
      'POST',
      bodyParams,
    )

    setSelectedProduct(newProductSelected)
    setShowChangePriceForm(false)

    return result
  }

  const cancelPriceChange = () => setShowChangePriceForm(false)

  return (
    <>
      {newProductSelected !== currentProductSelected && (
        <div className="container">
          <div className="price">
            <div style={{ border: '1px solid #ccc', marginTop: '1rem' }}>
              <span>
                <b>Current price: </b>
              </span>
              <span>{currentProductSelected}</span>
            </div>
          </div>
          <div className="new-price">
            <div style={{ border: '1px solid #ccc', marginTop: '1rem' }}>
              <span>
                <b>New price: </b>
              </span>
              <span>{newProductSelected}</span>
            </div>
          </div>

          <div>
            <p>
              You will be charged {console.log(invoicePreview)}
              {(invoicePreview &&
                getFormattedAmount(invoicePreview.amount_due)) ||
                ' '}{' '}
              on{' '}
              <span>
                {(invoicePreview.next_payment_attempt &&
                  getDateStringFromUnixTimestamp(
                    invoicePreview.next_payment_attempt,
                  )) ||
                  ''}
              </span>
            </p>
            <button onClick={() => confirmPriceChange()} type="submit">
              <div>
                <span>Confirm Change</span>
              </div>
            </button>
            <button onClick={() => cancelPriceChange()} type="submit">
              <div>
                <span>Cancel</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default withRouter(PriceChangeForm)