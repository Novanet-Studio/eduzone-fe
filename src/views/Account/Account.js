import axios from 'axios'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Modal from '@components/Modal'
import Product from '@components/Product'
import { products, URL } from '@constants'
import { Footer, Header } from '@layout'
import { useError, useModal, useRetrieveCustomerPaymentMethod } from '@hooks'
import {
  getUser,
  getUserAccount,
  removeUserSession,
  setUserSession,
} from '@utils/common'
import { AccountDetails, AccountEditing, PriceChangeForm, ManageLicense } from './components'
import './Account.scss'
import ErrorMessage from '@/components/ErrorMessage'

function Account() {
  const history = useHistory()
  const account = getUserAccount()
  const user = getUser()
  const customerPaymentMethod = useRetrieveCustomerPaymentMethod(
    account.paymentMethodId,
  )
  const [error, showError] = useError(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePriceForm, setShowChangePriceForm] = useState(false)
  const [subscriptionCancelled, setSubscriptionCancelled] = useState(false)
  const [newProductSelected, setNewProductSelected] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(account.priceId)
  const [loadingContent, setLoadingContent] = useState(false)
  const [isOpen, closeModal] = useModal(false)

  const productName = (name) => {
    const product = products.filter((product) => product.type === name)
    return product[0].name
  }

  const productImage = (name) => {
    const product = products.filter((product) => product.type === name)
    return product[0].image
  }

  useEffect(() => {
    if (!subscriptionCancelled) return
    const fetchUser = async () => {
      setLoadingContent(true)
      try {
        const {
          data: { user },
        } = await axios.get(`${URL}/auth/me`)
        setUserSession(user)
        setLoadingContent(false)
      } catch (error) {
        console.log({ error })
        setLoadingContent(false)
        throw new Error('Error getting updated user data')
      }
    }

    fetchUser()
  }, [subscriptionCancelled])

  const handleLogout = () => {
    removeUserSession()
    history.push('/login')
  }

  const handleCancelSubscription = async () => {
    setLoadingContent(true)
    const bodyParams = {
      email: user.username,
      subscriptionId: account.subscription.id,
    }

    try {
      await axios.post(`${URL}/stripe/cancel-subscription`, bodyParams)
      await axios.get(`${URL}/user/deactivate/${user.username}`)
      setSubscriptionCancelled(true)
      alert('Subscription cancelled')
    } catch (error) {
      setLoadingContent(true)
      console.log({ error })
      throw new Error('Error while cancel subscription')
    }
  }

  const handleChangePriceForm = () => setShowChangePriceForm(true)
  const handleClick = (key) => setNewProductSelected(products[key].type)
  const handleEdit = () => setIsEditing(!isEditing)

  if (loadingContent) {
    return (
      <>
        <Header loggedIn={true} handleClick={handleLogout} />
        <section className="account">
          <div className="container">
            <div className="account__info">
              <h2>Account Settings</h2>
              <div className="account__card">
                <div className="account__card-header">
                  <p>Updating content ...</p>
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
      <Header loggedIn={true} onClick={handleLogout} />
      <Modal isOpen={isOpen} closeModal={closeModal} />
      {error && <ErrorMessage error={error} />}
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
                <AccountEditing editing={setIsEditing} />
              ) : (
                <AccountDetails />
              )}
            </div>

            {/* User account */}

            <ManageLicense showError={showError} loading={setLoadingContent} />

            {/* Stripe account */}
            {account.subscription.id ? (
              <div className="account__card">
                <div className="account__card-header">
                  <h3 className="account__card-title">Billing account information</h3>
                  <p>Current plan</p>
                  <span className="account__card-data">
                    {productName(selectedProduct)}
                    <img src={productImage(selectedProduct)} alt={`Product ${productName(selectedProduct)}`} />
                  </span>
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
                  onClick={() => handleCancelSubscription()}
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
                    customerId={account.subscription.customer}
                    subscriptionId={account.subscription.id}
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
              href="https://www.eduzoneserver.com/studentportal/"
              target="_blank"
              rel="noreferrer"
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

export default Account
