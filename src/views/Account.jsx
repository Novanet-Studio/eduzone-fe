import React, { useEffect, useState } from 'react'

import { apiRequest, products, URL } from '../utils'
import Footer from '../components/Footer'
import Product from '../components/Product'
import TopNavigationBar from '../components/TopNavigationBar'
import PriceChangeForm from '../components/PriceChangeForm'
import { withRouter } from 'react-router-dom'

const buttonStyle = {
  border: '1px solid #ccc',
  margin: '1rem',
  padding: '1rem',
  width: '13rem',
  cursor: 'pointer',
  backgroundColor: '#aaa',
  color: '#222'
}

function Account({ location }) {
  
  if (!location.state)
    window.location.href = '/'
  
  const [accountInformation] = useState(location.state.accountInformation)
  const [customerPaymentMethod, setCustomerPaymentMethod] = useState(null)
  const [showChangePriceForm, setShowChangePriceForm] = useState(false)
  const [subscriptionCancelled, setSubscriptionCancelled] = useState(false)
  const [newProductSelected, setNewProductSelected] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(
    accountInformation.priceId
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
      subscriptionId: accountInformation.subscription.id
    })

    setSubscriptionCancelled(true)
  }

  const signOut = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <>
      <TopNavigationBar loggedIn={true} handleClick={signOut} />
      {subscriptionCancelled ? (
        <div>
          <h3>Subscription canceled</h3>
          <div>
            <button type="button" onClick={() => resetDemo()}>
              Restart Demo
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          maxWidth: 500,
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: '#f0f0f0',
          padding: '2em',
          display: "flex",
          flexDirection: "column",
        }}>
          <div className="title">
            <h3>Account Settings</h3>
          </div>
          <div>
            <h4>Account</h4>
            <div>
              <h5>Current Price</h5>
              <span>{selectedProduct}</span>
            </div>
          </div>

          <div className="header">
            <div className="card-info">
              <h4>Credit Card</h4>
              <span>{customerPaymentMethod}</span>
            </div>

            <div onClick={() => handleChangePriceForm()} style={buttonStyle}>
              <span>Change pricing plan {'->'}</span>
            </div>

            <div onClick={() => cancelSubscription()} style={buttonStyle}>
              <span>Cancel subscription {'->'}</span>
            </div>
          </div>

          {showChangePriceForm ? (
            <div className="prices-form">
              <h3>Change pricing plan</h3>
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
      )}
      <Footer />
    </>
  )
}

export default withRouter(Account)