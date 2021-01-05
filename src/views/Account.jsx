import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import { apiRequest, products, URL } from '../utils'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Product from '../components/Product'
import PriceChangeForm from '../components/PriceChangeForm'
import './Account.scss'

function Account({ location }) {
  if (!location.state) window.location.href = '/'

  const [accountInformation] = useState(location.state.accountInformation)
  const [customerPaymentMethod, setCustomerPaymentMethod] = useState(null)
  const [showChangePriceForm, setShowChangePriceForm] = useState(false)
  const [subscriptionCancelled, setSubscriptionCancelled] = useState(false)
  const [newProductSelected, setNewProductSelected] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(
    accountInformation.priceId,
  )

  useEffect(() => {
    async function fetchData() {
      try {
        const responseBody = await apiRequest(
          `${URL}/stripe/retrieve-customer-payment-method`,
          'POST',
          {
            paymentMethodId: accountInformation.paymentMethodId,
          },
        )
        const paymentMethod =
          responseBody.card.brand + ' •••• ' + responseBody.card.last4

        setCustomerPaymentMethod(paymentMethod)
      } catch (e) {
        console.log(e)
        throw e
      }
    }

    fetchData()
  }, [accountInformation.paymentMethodId])

  const handleChangePriceForm = () => setShowChangePriceForm(true)
  const handleClick = (key) => setNewProductSelected(products[key].name)
  const resetDemo = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  async function cancelSubscription() {
    console.log(accountInformation.subscription)
    await apiRequest(`${URL}/stripe/cancel-subscription`, 'POST', {
      subscriptionId: accountInformation.subscription.id,
    })

    setSubscriptionCancelled(true)
  }

  const signOut = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  const handleEdit = () => setIsEditing(!isEditing)

  const updateInformation = (user) =>
    setAccountInformation({ ...accountInformation, user })

  console.log(accountInformation)

  return (
    <>
      <Header loggedIn={true} handleClick={signOut} />
      {subscriptionCancelled ? (
        <section className="canceled">
          <div className="container">
            <h2 className="canceled__title">Subscription canceled</h2>
            <button
              className="canceled__button"
              type="button"
              onClick={() => resetDemo()}
            >
              Restart Demo
            </button>
          </div>
        </section>
      ) : (
        <section className="account">
          <div className="container">
            <div className="account__info">
              <h2 className="account__title">Account Settings</h2>

              <div className="account__card">
                <div className="account__card-header">
                  <h3 className="account__card-title">Account</h3>
                  <p>Current Price</p>
                  <span className="account__card-data">{selectedProduct}</span>
                </div>
                <hr className="account__line" />
                <div className="account__card-info">
                  <h3 className="account__card-title">Credit Card</h3>
                  <span className="account__card-data">
                    {customerPaymentMethod}
                  </span>
                </div>

                <div
                  className="account__button"
                  onClick={() => handleChangePriceForm()}
                >
                  Change pricing plan {'>'}
                </div>

                <div
                  className="account__button"
                  onClick={() => cancelSubscription()}
                >
                  Cancel subscription {'>'}
                </div>
              </div>

              {showChangePriceForm ? (
                <div className="account__card">
                 <h2 className="account__title">Change pricing plan</h2>
                  <div className="wrapper">
                    {products.map((product, index) => {
                      let currentProductSelected = false
                      if (product.name === selectedProduct) {
                        currentProductSelected = true
                      }
                      return (
                        <Product
                          key={index}
                          product={product}
                          currentProductSelected={currentProductSelected}
                          handleClick={handleClick}
                        />
                      )
                    })}
                  </div>
                  {newProductSelected ? (
                    <PriceChangeForm
                      customerId={accountInformation.subscription.customer}
                      subscriptionId={accountInformation.subscription.id}
                      currentProductSelected={selectedProduct}
                      newProductSelected={newProductSelected}
                      setShowChangePriceForm={setShowChangePriceForm}
                      setSelectedProduct={setSelectedProduct}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  )
}

export default withRouter(Account)
