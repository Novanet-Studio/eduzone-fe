import axios from 'axios'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import Modal from '@components/Modal'
import Product from '@components/Product'
import { products, URL } from '@constants'
import { Footer, Header } from '@layout'
import { useError, useModal, useRetrieveCustomerPaymentMethod } from '@hooks'
import { ErrorMessageContainer } from '@/components/ErrorMessage'
import { getUser, getUserAccount, setUserSession } from '@utils/common'
import {
  AccountDetails,
  AccountEditing,
  PriceChangeForm,
  ManageLicense,
} from './components'
import './Account.scss'

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
  const { register, handleSubmit, errors } = useForm({ mode: 'onChange' })
  const [isOpenModal, , closeModal] = useModal(
    history.location?.state?.isNew ?? false,
  )
  const [isOpenModalSubs, openModalSubs, closeModalSubs] = useModal(false)

  const extractProductProperty = (name, prop) => {
    const isPropName = prop === 'name'
    const isPropImage = prop === 'image'

    console.log({ isPropName,isPropImage })

    if (!isPropName && !isPropImage) {
      return null
    }
    
    return products.filter((product) => product.type === name)[0][prop]
  }

  useEffect(() => {
    if (!subscriptionCancelled) return

    setLoadingContent(true)

    const cancelSubscription = async () => {
      setLoadingContent(true)
      const bodyParams = {
        email: user.username,
        subscriptionId: account.subscription.id,
      }

      try {
        await axios.post(`${URL}/stripe/cancel-subscription`, bodyParams)
        await axios.get(`${URL}/user/deactivate/${user.username}`)
        alert('Subscription cancelled succesfully')
        setSubscriptionCancelled(true)
        setLoadingContent(false)
        window.location.reload()
      } catch (error) {
        console.log({ error })
        setLoadingContent(false)
        throw new Error('Error while cancel subscription')
      }
    }

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

    cancelSubscription()
    fetchUser()
    setLoadingContent(true)
  }, [subscriptionCancelled, account.subscription.id, user.username])
  
  const handleConfirmPasswordForm = async ({ confirmPassword }) => {
    const signinParams = {
      userName: user.username,
      password: confirmPassword,
    }

    try {
      const { data } = await axios.post(`${URL}/auth/signin`, signinParams)

      if (!data) {
        throw new Error('Password not valid')
      }

      closeModalSubs()
      setSubscriptionCancelled(true)

    } catch (error) {
      console.log({ error })
      throw new Error('There was an error while confirm user password')
    }
  }

  const handleCancelSubscription = () => {
    openModalSubs()
  }

  const handleChangePriceForm = () => setShowChangePriceForm(true)
  const handleClick = (key) => setNewProductSelected(products[key].type)
  const handleEdit = () => setIsEditing(!isEditing)

  if (loadingContent) {
    return (
      <>
        <Header />
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
      <Header />
      <Modal isOpen={isOpenModal} closeModal={closeModal}>
        <h2 className="modal__title">¡Thanks for you subscription!</h2>
        <p className="modal__text">
          We have sent you an email with your access credentials for future
          reference.
        </p>
        <button className="button modal__button modal__button-blue">
          <a
            href="https://www.eduzoneserver.com/"
            target="_blank"
            rel="noreferrer"
          >
            Access now
          </a>
        </button>
      </Modal>
      <Modal isOpen={isOpenModalSubs} closeModal={closeModalSubs}>
        <form onSubmit={handleSubmit(handleConfirmPasswordForm)}>
          <div className="edit__form-group">
            <label className="edit__form-label" htmlFor="firstname">
              Confirm password
            </label>
            <input
              className="edit__form-input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              ref={register({
                minLength: {
                  value: 6,
                  message: 'Your password must be at least 6 characters',
                },
                maxLength: {
                  value: 20,
                  message: 'The password must be between 6 and 20 characters',
                },
              })}
            />
            <ErrorMessage
              errors={errors}
              name="confirmPassword"
              as={<ErrorMessageContainer />}
            />
          </div>
          <button className="edit__button-update" type="submit">
            confirm
          </button>
        </form>
      </Modal>
      {error && <ErrorMessage error={error} />}
      <section className="account">
        <div className="container">
          <div className="account__info">
            <h2 className="account__title">Account Settings</h2>

            {/* User account */}
            <div className="account__card">
              <div className="account__card-header">
                <h3 className="account__card-title">User account</h3>
              </div>
              <hr className="account__line" />
              {isEditing ? (
                <AccountEditing setEditing={setIsEditing} />
              ) : (
                <AccountDetails />
              )}

              <button className="button edit__button" onClick={handleEdit}>
                {isEditing ? 'Cancel editing' : 'Edit info'}
              </button>
            </div>

            {/* User account */}

            <ManageLicense showError={showError} loading={setLoadingContent} />

            {/* Stripe account */}
            {account.subscription.id ? (
              <div className="account__card">
                <div className="account__card-header">
                  <h3 className="account__card-title">
                    Billing account information
                  </h3>
                  <div className="account__card-info">
                    <span className="account__card-data">
                      <h4>Current plan:</h4>
                      <p className="account__card-data">
                        {`\u00A0${extractProductProperty(selectedProduct, 'name')}`}
                      </p>
                    </span>
                  </div>
                  <div className="account__card-info">
                    <img
                      className="account__card-img"
                      src={extractProductProperty(selectedProduct, 'image')}
                      alt={`Product ${extractProductProperty(selectedProduct, 'name')}`}
                    />
                  </div>
                </div>
                <hr className="account__line" />
                <div className="account__card-info">
                  <h3 className="account__card-title">Credit Card</h3>
                  <span className="account__card-data">
                    {customerPaymentMethod}
                  </span>
                </div>

                <div
                  className="button account__button"
                  onClick={() => handleChangePriceForm()}
                >
                  Change pricing plan {'»'}
                </div>

                <div
                  className="button account__button"
                  onClick={handleCancelSubscription}
                >
                  Cancel subscription {'»'}
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
              className="button account__button"
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
