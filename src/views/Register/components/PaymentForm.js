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

import { ErrorMessageContainer } from '@components/ErrorMessage'
// import { useFormInput } from '@hooks'
import {
  checkUserExists,
  createCustomer,
  createUser,
} from '@services/eduzoneServer'
import {
  createSubscription,
  retryInvoiceWithNewPaymentMethod,
} from '@services/stripe'
import './PaymentForm.scss'
import IconSegurity from '@images/icon_segurity.svg'

const { REACT_APP_STRIPE_PK } = process.env

// Load stripe with Public key
const stripePromise = loadStripe(REACT_APP_STRIPE_PK)

if (!REACT_APP_STRIPE_PK) {
  console.error('**Stripe publishable key invironment variable not set**')
  console.error('**Add an environment variable REACT_APP_STRIPE_PK**')
  console.error('**Or replace .env.example with .env **')
}

const CheckoutForm = ({ productSelected, input, showError }) => {
  const stripe = useStripe()
  const history = useHistory()
  const elements = useElements()
  const sessionProduct = JSON.parse(sessionStorage.getItem('eduzone::product'))
  const { register, handleSubmit, errors } = useForm()
  const [userCreated, setUserCreated] = useState(false)
  const [subscribing, setSubscribing] = useState(false)
  const [accountInformation, setAccountInformation] = useState(false)

  const comparePassword = () => input.password === input.confirmPassword

  // const resetPasswords = () => {
  //   input.password.reset()
  //   input.confirmPassword.reset()
  // }

  // const resetInput = () => {
  //   resetPasswords()
  //   input.email.reset()
  //   firstname.reset()
  //   lastname.reset()
  // }

  const handleSubmitForm = async ({ firstname, lastname }) => {
    setSubscribing(true)

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    if (!comparePassword()) {
      // resetPasswords()
      // Must reset the input password
      showError('Passwords not match')
      console.log('Passwords not match')
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

        console.log('subscription info: ', info)

        sessionStorage.setItem('paymentMethodId', paymentMethodId)
        sessionStorage.setItem('new::user', true)
        // resetInput()
        setUserCreated(true)
        setAccountInformation(info)
      }
      setSubscribing(false)
    } catch (error) {
      console.log({ error })
      setSubscribing(false)
      //   resetInput()
      showError(error.message)
    }
  }

  if (accountInformation && userCreated) {
    console.log('[Account Information]', accountInformation)
    history.push('/account')
  }

  return (
    <div className="payment">
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
          <input
            className="payment__input"
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
        </div>
        <div className="payment__form-control">
          <input
            className="payment__input"
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
        </div>
        <div className="payment__form-group">
          <div className="payment__form-element">
            <CardElement options={{}} />
          </div>
        </div>
        <p className="payment__text">
          By clicking <b>Subscribe to Edu-zone</b>, you are confirming that you
          have read and accept our Terms of Service. You also agree that Eduzone
          will save your card details in order to automatically renew your
          subscription and process future account updates. If we change in any
          way the way we use the data we store from your card, we will notify
          you using the email address you provided. This site is protected by
          reCAPTCHA and subject to Google's Privacy Policy and Terms of Service.
        </p>
        <button
          className="payment__button"
          type="submit"
          disabled={subscribing}
        >
          {subscribing ? 'Subscribing...' : 'Subscribe to Edu-zone'}
        </button>
        <button className="payment__segurity">
          <img
            className="payment__segurity-img"
            src={IconSegurity}
            alt="icon segurity server"
          />{' '}
          Segurity server
        </button>
        <p className="payment__text">
          You can un-subscribe at anytime, remember your first payment will be
          30 days after your registration.
        </p>
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
