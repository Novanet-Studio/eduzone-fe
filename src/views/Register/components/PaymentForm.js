import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useForm } from 'react-hook-form'
import { ErrorMessage as ErrorFormMessage } from '@hookform/error-message'

import { ErrorMessageContainer, SuccessMessage } from '@components/ErrorMessage'
import { useModal } from '@hooks'
import Modal from '@/components/Modal'
import {
  checkUserExists,
  createCustomer,
  createUser,
} from '@services/eduzoneServer'
import {
  createSubscription,
  retryInvoiceWithNewPaymentMethod,
} from '@services/stripe'
import IconSecure from '@images/icon_secure.svg'
import stripeLogo from '@images/stripe_logo.svg'
import './PaymentForm.scss'

const { REACT_APP_STRIPE_PK } = process.env

// Load stripe with Public key
const stripePromise = loadStripe(REACT_APP_STRIPE_PK)

if (!REACT_APP_STRIPE_PK) {
  console.error('**Stripe publishable key invironment variable not set**')
  console.error('**Add an environment variable REACT_APP_STRIPE_PK**')
  console.error('**Or replace .env.example with .env **')
}

const CheckoutForm = ({
  productSelected,
  input,
  showError,
  reset,
  disabled,
}) => {
  const stripe = useStripe()
  const history = useHistory()
  const elements = useElements()
  const sessionProduct = JSON.parse(sessionStorage.getItem('eduzone::product'))
  const { register, handleSubmit, errors, getValues } = useForm({
    mode: 'onChange',
  })
  const [userCreated, setUserCreated] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [accountInformation, setAccountInformation] = useState(false)
  const [isOpenModal, openModal, closeModal] = useModal(false)
  // eslint-disable-next-line
  const [_, setError] = useState(null)

  const comparePassword = () => input.password === input.confirmPassword
  const compareEmail = () => input.email === input.confirmEmail
  const areFieldsFull = () => {
    const { firstname, lastname } = getValues()
    const { email, confirmEmail, password, confirmPassword } = input
    return (
      email &&
      confirmEmail &&
      password &&
      confirmPassword &&
      firstname &&
      lastname
    )
  }

  const onChangeStripeCard = ({ complete }) => {
    if (!complete) return

    if (!input) return

    if (!areFieldsFull()) return

    if (disabled) return

    setIsButtonDisabled(false)
  }

  const handleSubmitForm = async ({ firstname, lastname }) => {
    setSubscribing(true)

    if (!stripe || !elements) {
      return
    }

    if (!compareEmail()) {
      reset()
      showError('Emails not match')
      setSubscribing(false)
      return
    }

    if (!comparePassword()) {
      reset()
      showError('Passwords not match')
      setSubscribing(false)
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    // If a previous payment was attempted, get the lastest invoice
    const latestInvoicePaymentIntentStatus = localStorage.getItem(
      'latestInvoicePaymentIntentStatus',
    )

    // Use your card Element with other Stripe.js APIs
    try {
      const exists = await checkUserExists(input.email)
      if (exists) {
        reset()
        setSubscribing(false)
        showError('User already exists')
        return
      }

      const customer = await createCustomer(input.email)

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (error) {
        console.log('[createPaymentMethod error]', error)
        setSubscribing(false)
        showError(error && error.message)
        return
      }

      const paymentMethodId = paymentMethod.id
      const customerId = customer.id

      if (latestInvoicePaymentIntentStatus === 'requires_payment_method') {
        // Update the payment method and retry invoice payment
        const invoiceId = localStorage.getItem('latestInvoiceId')
        retryInvoiceWithNewPaymentMethod({
          stripe,
          invoiceId,
          customerId,
          paymentMethodId,
          priceId: productSelected.type.toUpperCase(),
        })
        return
      }

      // Create the subscription
      const { subscriptionComplete } = await createSubscription({
        paymentMethodId,
        productSelected,
        customerId,
        stripe,
      })

      if (subscriptionComplete) {
        console.log('Creating user in magic box')

        const { accountInformation: info } = await createUser({
          firstname,
          lastname,
          userName: input.email,
          password: input.password,
          type: productSelected.type,
        })

        sessionStorage.setItem('paymentMethodId', paymentMethodId)
        setUserCreated(true)
        setAccountInformation(info)
      }
      setSubscribing(false)
    } catch (error) {
      console.log({ error })
      setSubscribing(false)
      setError(error?.response?.data?.message)
      openModal()
    }
  }

  if (accountInformation && userCreated) {
    console.log('[Account Information]', accountInformation)
    history.push('/account', { isNew: true })
  }

  return (
    <div className="payment">
      <Modal isOpen={isOpenModal} closeModal={closeModal}>
        <h2 className="modal__title">
          There was an error. Your payment has been not processed
        </h2>
        <p className="modal__text">Please verify the credit card information</p>
      </Modal>
      <h2 className="payment__title">Enter your card details</h2>
      <h3 className="payment__subtitle">Your subscription will start now</h3>
      <div className="payment__data">
        <p className="payment__price">
          {'»'} Total due now <span>{productSelected.price}</span>
        </p>
        <p className="payment__name">
          {'»'} Subscribing to <span>{productSelected.name}</span>
        </p>
        <img
          className="payment__pro-img"
          src={sessionProduct.image}
          alt={`Package ${sessionProduct.name}`}
        />
      </div>
      <form
        id="payment-form"
        className="payment__form"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className="payment__form-control">
          <p className="payment__text">
            <b>Remember:</b> All our subscriptions include a 30-day free trial,
            we will not charge anything until 7 days after the subscription date
            you can cancel your subscription at any time.
          </p>
          <input
            className="input payment__input"
            type="text"
            name="firstname"
            placeholder="First name"
            ref={register({
              required: {
                value: true,
                message: 'You must enter your first name name',
              },
            })}
          />
          <ErrorFormMessage
            errors={errors}
            name="firstname"
            as={<ErrorMessageContainer />}
          />
          <SuccessMessage
            errors={errors}
            name="firstname"
            values={getValues()}
          />
        </div>
        <div className="payment__form-control">
          <input
            className="input payment__input"
            type="text"
            name="lastname"
            placeholder="Last name"
            ref={register({
              required: {
                value: true,
                message: 'You must enter your last name',
              },
            })}
          />
          <ErrorFormMessage
            errors={errors}
            name="lastname"
            as={<ErrorMessageContainer />}
          />
          <SuccessMessage
            errors={errors}
            name="lastname"
            values={getValues()}
          />
        </div>
        <div className="payment__form-group">
          <div className="payment__form-element">
            {/* TODO: Show Error onChange input */}
            <CardElement options={{}} onChange={onChangeStripeCard} />
          </div>
          <img
            className="payment__form-stripe"
            src={stripeLogo}
            alt="secure server icon"
          />
        </div>
        <p className="payment__text">
          By clicking <b>Subscribe to Edu-zone</b>, you are confirming that you
          have read and accept our{' '}
          <a href="/" target="_blank">
            Terms of Service.
          </a>{' '}
          You also agree that Eduzone will renew your subscription and process
          future account updates. If we change in any way the way we use the
          data we store from your account, we will notify you using the email
          address you provided.
        </p>
        <button
          className="button payment__button"
          type="submit"
          disabled={isButtonDisabled ?? subscribing}
        >
          {subscribing ? 'Subscribing...' : 'Subscribe to Edu-zone'}
        </button>
        <div className="payment__security">
          <img
            className="payment__security-img"
            src={IconSecure}
            alt="secure server icon"
          />{' '}
          Secure server
        </div>
      </form>
    </div>
  )
}

const PaymentForm = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
)

export default PaymentForm
