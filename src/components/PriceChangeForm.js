import { useEffect, useState } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

import { URL } from '../constants'
import { getDateStringFromUnixTimestamp, getFormattedAmount } from '../utils'
import './PriceChangeForm.scss'

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
      const result = await axios.post(
        `${URL}/stripe/retrieve-upcoming-invoice`,
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
    const result = await axios.post(
      `${URL}/stripe/update-subscription`,
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
        <div className="price container">
          <p className="price-current">
            <span>
              <b>Current price: </b>
            </span>
            <span>{currentProductSelected}</span>
          </p>
          <p className="price-new">
            <div>
              <span>
                <b>New price: </b>
              </span>
              <span>{newProductSelected}</span>
            </div>
          </p>

          <p className="change__text">
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
          <button
            className="change__button"
            onClick={() => confirmPriceChange()}
            type="submit"
          >
            Confirm Change
          </button>
          <button
            className="change__button"
            onClick={() => cancelPriceChange()}
            type="submit"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  )
}

export default withRouter(PriceChangeForm)
