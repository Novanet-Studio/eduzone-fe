import axios from 'axios'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { ErrorMessage } from '../share'
import { useError, useFormInput } from '../../hooks'
import { URL } from '../../constants'
import {
  getUserCredentials,
  removeUserCredentials,
  setAccount,
  setToken,
  setUserSession,
} from '../../utils/common'

import './PaymentForm.scss'

const { REACT_APP_STRIPE_PK } = process.env

// Load stripe with Public key
const stripePromise = loadStripe(REACT_APP_STRIPE_PK)

if (!REACT_APP_STRIPE_PK) {
  console.error('**Stripe publishable key invironment variable not set**')
  console.error('**Add an environment variable REACT_APP_STRIPE_PK**')
  console.error('**Or replace .env.example with .env **')
}

const CheckoutForm = ({ productSelected, customer }) => {
  const [userCreated, setUserCreated] = useState(false)
  const stripe = useStripe()
  const history = useHistory()
  const elements = useElements()
  const firstname = useFormInput('')
  const lastname = useFormInput('')
  const [subscribing, setSubscribing] = useState(false)
  const [error, showError] = useError(null)
  const [accountInformation, setAccountInformation] = useState(false)

  async function handlePaymentCustomerAction({
    subscription,
    invoice,
    priceId,
    paymentMethodId,
    isRetry,
  }) {
    console.log('[handlePaymentCustomerAction]', {
      subscription,
      invoice,
      priceId,
      paymentMethodId,
      isRetry,
    })
    if (subscription && subscription.status === 'active') {
      console.log('[Subscription == active]')
      // Subscription is active, no custumer actions required
      return { subscription, priceId, paymentMethodId }
    }

    const paymentIntent = invoice
      ? invoice.payment_intent
      : subscription.latest_invoice.payment_intent

    if (
      paymentIntent.status === 'requires_action' ||
      (isRetry === true && paymentIntent.status === 'requires_payment_method')
    ) {
      const result = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: paymentMethodId,
        },
      )

      if (result.error) {
        // To Display error message in UI
        // The card was declined, insufficient founds, card has expired, etc
        throw result
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // There's a risk of the customer closing the window before callback
          // execution. To handle this case, set up a webhook endpoint and
          // listen to invoice.payment_succeeded. This webhook endpoin
          // return anm Invoice
          return {
            priceId,
            subscription,
            invoice,
            paymentMethodId,
          }
        }
      }
    } else {
      // No customer action needed
      return { subscription, priceId, paymentMethodId }
    }
  }

  function handleRequiresPaymentMethod({
    subscription,
    paymentMethodId,
    priceId,
  }) {
    console.log('[handleRequiresPaymentMethod]', {
      subscription,
      paymentMethodId,
      priceId,
    })
    if (subscription.status === 'active') {
      // Subscription is active, no customer actions required
      return { subscription, priceId, paymentMethodId }
    } else if (
      subscription.latest_invoice.payment_intent.status ===
      'require_payment_method'
    ) {
      // Using localStorage to store the state of the retry here
      // Store the latest invoice ID and status
      localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id)
      localStorage.setItem(
        'latestInvoicePaymentIntentStatus',
        subscription.latest_invoice.payment_intent.status,
      )
      showError('Your card was declined.')
      setSubscribing(false)
      throw new Error('Your card was declined.')
    } else {
      return { subscription, priceId, paymentMethodId }
    }
  }

  async function retryInvoiceWithNewPaymentMethod({
    paymentMethodId,
    invoiceId,
  }) {
    const priceId = productSelected.name.toUpperCase()
    const bodyParams = {
      paymentMethodId,
      invoiceId,
      customer: customer.id,
    }

    try {
      const { data: retryInvoiceResponse } = await axios.post(
        `${URL}/stripe/retry-invoice`,
        bodyParams,
      )
      // Normalize the result to contain the object returned by Stripe.
      // Add the addional details we need.
      const handlePaymentCustomerActionBody = {
        priceId,
        paymentMethodId,
        invoice: retryInvoiceResponse,
        isRetry: true,
      }
      // Some payment methods require a customer to be on session
      // to complete the payment process. Check the status of the
      // payment intent to handle these actions.
      const handlePaymentCustomerActionResponse = handlePaymentCustomerAction(
        handlePaymentCustomerActionBody,
      )
      return onSubscriptionComplete(handlePaymentCustomerActionResponse)
    } catch (error) {
      // If the card is declined, display an error to the user.
      // An error has happened. Display the failure to the user here.
      setSubscribing(false)
      showError(error && error.error && error.error.decline_code)
    }
  }

  function onSubscriptionComplete(result) {
    console.log('[onSubscriptionComplete]', result)
    // Payment was successful. Provision access to your service.
    // Remove invoice from localstorage because payment is now complete.
    // clearCache();
    if (result && !result.subscription) {
      const subscription = { id: result.invoice.subscription }
      result.subscription = subscription
      localStorage.clear()
    }

    // Update accountInformation with useData (global context)
    setAccountInformation(result)
    return { subscriptionComplete: true }
    // Change your UI to show a success message to your customer.
    // onSubscriptionSampleDemoComplete(result);
    // Call your backend to grant access to your service based on
    // the product your customer subscribed to.
    // Get the product by using result.subscription.price.product
  }

  async function createSubscription({ paymentMethodId }) {
    const priceId = productSelected.name.toUpperCase()
    const bodyParams = {
      paymentMethodId,
      priceId,
      customerId: customer.id,
    }

    try {
      const { data } = await axios.post(
        `${URL}/stripe/create-subscription`,
        bodyParams,
      )
      const result = {
        paymentMethodId,
        subscription: data,
        priceId: productSelected.name,
      }
      const paymentCustomerActionResult = await handlePaymentCustomerAction(
        result,
      )
      const handlePaymentMethodResult = handleRequiresPaymentMethod(
        paymentCustomerActionResult,
      )
      return onSubscriptionComplete(handlePaymentMethodResult)
    } catch (error) {
      console.log({ error })
      setSubscribing(false)
      showError(error.message || error.error.decline_code)
    }
  }

  // Register new user after subscription
  // TODO: Extract this function into new file
  async function createUser({ firstname, lastname, userName, password }) {
    const bodyParams = {
      firstname,
      lastname,
      userName,
      password,
    }

    console.log('[BODY_PARAMS]')
    console.log(bodyParams)

    try {
      const { data } = await axios.post(`${URL}/auth/signup`, bodyParams)

      if (!data.auth) {
        console.log('Cannot register user')
        showError('Cannot register user')
        return
      }

      setToken(data.token)

      const { data: me } = await axios.get(`${URL}/auth/me`)
      const { priceId, paymentMethodId, subscription, user } = me
      
      setUserSession(user)
      setAccount({
        priceId,
        paymentMethodId,
        subscription,
      })
      setUserCreated(true)
      setAccountInformation(me)
    } catch (error) {
      setSubscribing(false)
      console.log({ error })
      showError(error.response.data.message)
      throw new Error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubscribing(true)

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
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

      console.log('[PaymentMethod]', paymentMethod)
      const paymentMethodId = paymentMethod.id
      if (latestInvoicePaymentIntentStatus === 'requires_payment_method') {
        // Update the payment method and retry invoice payment
        const invoiceId = localStorage.getItem('latestInvoiceId')
        retryInvoiceWithNewPaymentMethod({
          paymentMethodId: paymentMethodId,
          invoiceId: invoiceId,
        })
        return
      }

      // Create the subscription
      const { subscriptionComplete } = await createSubscription({
        paymentMethodId: paymentMethodId,
      })

      if (subscriptionComplete) {
        console.log('Creating user in magic box')
        const { email, password } = getUserCredentials()

        createUser({
          firstname: firstname.value,
          lastname: lastname.value,
          userName: email,
          password: password,
        })

        sessionStorage.setItem('paymentMethodId', paymentMethodId)
        sessionStorage.setItem('new::user', true)
        removeUserCredentials()
      }
    } catch (error) {
      console.log({ error })
      setSubscribing(false)
      showError(error.message)
      throw new Error(error)
    }
  }
  
  if (accountInformation && userCreated) {
    console.log('[Account Information]', accountInformation)
    history.push('/account')
  }

  return (
    <>
      <div className="payment">
        {error && <ErrorMessage errorMessage={error} />}
        <p className="payment__text">
          Enter your card details. <br />
          Your subscription will start now
        </p>
        <p className="payment__price">
          {'->'} Total due now <span>{productSelected.price}</span>
        </p>
        <p className="payment__name">
          {'->'} Subscribing to <span>{productSelected.name}</span>
        </p>
        <div className="payment__form">
          <input
            className="payment__input"
            type="text"
            id="name"
            name="firstname"
            placeholder="First name"
            value={firstname.value}
            onChange={firstname.onChange}
            required
          />
          <input
            className="payment__input"
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Last name"
            value={lastname.value}
            onChange={lastname.onChange}
            required
          />
        </div>
        <form
          id="payment-form"
          className="payment__form"
          onSubmit={handleSubmit}
        >
          <div className="payment__form-group">
            <label>Card number</label>
            <div className="payment__form-element">
              <CardElement options={{}} />
            </div>
          </div>
          <button
            className="payment__button"
            type="submit"
            disabled={subscribing}
          >
            {subscribing ? 'Subscribing...' : 'Subscribe to Edu-zone'}
          </button>
        </form>
        <p className="payment__text-down">
          By clicking "Subscribe to Edu-zone", you are confirming that you have
          read and accept our Terms of Service. You also agree that Eduzone will
          save your card details in order to automatically renew your
          subscription and process future account updates. If we change in any
          way the way we use the data we store from your card, we will notify
          you using the email address you provided. This site is protected by
          reCAPTCHA and subject to Google's Privacy Policy and Terms of Service.
        </p>
      </div>
    </>
  )
}

const PaymentForm = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
)

export default PaymentForm
