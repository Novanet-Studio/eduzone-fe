import axios from 'axios'
import { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Product from '../components/Product'
import PriceChangeForm from '../components/PriceChangeForm'
import AccountEditing from '../components/AccountEditing'
import AccountDetails from '../components/AccountDetails'
import { baseUrl } from '../App'
import { Auth, products, URL } from '../utils'
import './Account.scss'

function Account({ location }) {
  // if (!location.state) window.location.href = '/'

  const [accountInformation, setAccountInformation] = useState(
    location.state.accountInformation,
  )
  const [customerPaymentMethod, setCustomerPaymentMethod] = useState(null)
  const [showChangePriceForm, setShowChangePriceForm] = useState(false)
  const [subscriptionCancelled, setSubscriptionCancelled] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newProductSelected, setNewProductSelected] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(
    accountInformation.priceId,
  )
  const [loadingContent, setLoadingContent] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!accountInformation.paymentMethodId) return
      try {
        const { data } = await axios.post(
          `${URL}/stripe/retrieve-customer-payment-method`,
          {
            paymentMethodId: accountInformation.paymentMethodId,
          },
        )

        const paymentMethod = data.card.brand + ' •••• ' + data.card.last4

        setCustomerPaymentMethod(paymentMethod)
      } catch (error) {
        console.log('[CANCEL_SUBSCRIPTION]')
        console.log(error)
        throw new Error(error.message)
      }
    }

    fetchData()
  }, [accountInformation.paymentMethodId])

  useEffect(() => {
    if (!subscriptionCancelled) return

    async function fetchUser() {
      try {
        const { data } = await axios.get(`${URL}/auth/me`, {
          headers: {
            'x-access-token': Auth.getToken,
          },
        })
        console.log(accountInformation)
        setAccountInformation(data)
        setLoadingContent(false)
        console.log(data)
      } catch (error) {
        setLoadingContent(false)
        console.log('ERROR GETTING USER DATA')
        console.log(error)
      }
    }

    fetchUser()
  }, [subscriptionCancelled])

  const handleChangePriceForm = () => setShowChangePriceForm(true)
  const handleClick = (key) => setNewProductSelected(products[key].name)

  async function cancelSubscription() {
    setLoadingContent(true)
    try {
      await axios.post(`${URL}/stripe/cancel-subscription`, {
        subscriptionId: accountInformation.subscription.id,
      })

      await axios.get(
        `${URL}/user/deactivate/${accountInformation.user.username}`,
      )

      setSubscriptionCancelled(true)
      alert('Subscription cancelled')
    } catch (error) {
      setLoadingContent(false)
      console.log('[CANCEL_SUBSCRIPTION]')
      console.log(error.message)
    }
  }

  const signOut = () => {
    localStorage.clear()
    window.location.href = baseUrl
  }

  const handleEdit = () => setIsEditing(!isEditing)

  const updateInformation = (user) =>
    setAccountInformation({ ...accountInformation, user })

  console.log(accountInformation)

  if (loadingContent) {
    return (
      <>
        <Header loggedIn={true} handleClick={signOut} />
        <section className="account">
          <div className="container">
            <div className="account__info">
              <h2>Account Settings</h2>
              <div className="account__card">
                <div className="account__card-header">
                  <p>Loading ...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header loggedIn={true} handleClick={signOut} />
      <section className="account">
        <div className="container">
          <div className="account__info">
            <h2 className="account__title">Account Settings</h2>
            {/* User account */}
            <div className="account__card">
              <div className="account__card-header">
                <h3 className="account__card-title">User account</h3>
                <button className="edit__button" onClick={handleEdit}>
                  Edit info
                </button>
              </div>
              <hr className="account__line" />
              {isEditing ? (
                <AccountEditing
                  defaults={accountInformation.user}
                  updateInformation={updateInformation}
                  editing={setIsEditing}
                />
              ) : (
                <AccountDetails
                  firstname={accountInformation.user.firstname}
                  lastname={accountInformation.user.lastname}
                  email={accountInformation.user.username}
                  status={accountInformation.user.status}
                />
              )}
            </div>

            {/* Stripe account */}

            {accountInformation.subscription ? (
              <div className="account__card">
                <div className="account__card-header">
                  <h3 className="account__card-title">Billing account</h3>
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
            ) : (
              <div className="account__card">
                <div className="account__card-header">
                  <h3 className="account__card-title">
                    You don't have an billing account
                  </h3>
                </div>
                <hr className="account__line" />
                <div className="account__card-info">
                  <span className="account__card-data">
                    <p>Please, select a subscription</p>
                  </span>
                </div>
              </div>
            )}

            {showChangePriceForm ? (
              <div className="account__card">
                <h2 className="account__title">Change pricing plan</h2>
                <div className="prices__products">
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
            <p className="account__text-down">
              If you're not satisfied within 30 days, we will not charge you any
              amount.
            </p>
            <a
              className="account__button"
              href="https://www.edu-zone.org/"
              target="_blank"
            >
              Go to Edu-Zone
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default withRouter(Account)
