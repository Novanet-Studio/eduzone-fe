import axios from 'axios'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Redirect } from 'react-router-dom'
import { apiRequest, Auth, URL } from '../utils'
import './PaymentForm.scss'
import { useGlobal } from '../context/globalContext'
import Logo from '../assets/images/lock-solid-01.png'

const { REACT_APP_STRIPE_PK } = process.env

// Load stripe with Public Key
const stripePromise = loadStripe(REACT_APP_STRIPE_PK)

if (!REACT_APP_STRIPE_PK) {
  console.error('**Stripe publishable key invironment variable not set**')
  console.error('**Add an environment variable REACT_APP_STRIPE_PK**')
  console.error('**Or replace .env.example with .env **')
}

const CheckoutForm = ({ productSelected, customer, setSent, load }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [subscribing, setSubscribing] = useState(false)
  const [accountInformation, setAccountInformation] = useState(null)
  const [userData, setUserData] = useState(null)
  const [userCreated, setUserCreated] = useState(false)
  const [error, setError] = useState('')
  const { formState, updateFormState } = useGlobal()

  let temp = null

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
      throw new Error('Your card was declined.')
    } else {
      return { subscription, priceId, paymentMethodId }
    }
  }

  function retryInvoiceWithNewPaymentMethod({ paymentMethodId, invoiceId }) {
    const priceId = productSelected.name.toUpperCase()
    const bodyParams = {
      paymentMethodId,
      invoiceId,
      customer: customer.id,
    }
    // TODO: makes a refactor of this return
    return (
      apiRequest(`${URL}/stripe/retry-invoice`, 'POST', bodyParams)
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer.
            throw result
          }
          return result
        })
        // Normalize the result to contain the object returned by Stripe.
        // Add the addional details we need.
        .then((result) => {
          return {
            // Use the Stripe 'object' property on the
            // returned result to understand what object is returned.
            invoice: result,
            paymentMethodId: paymentMethodId,
            priceId: priceId,
            isRetry: true,
          }
        })
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        .then(handlePaymentCustomerAction)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .catch((error) => {
          console.log(error)
          // An error has happened. Display the failure to the user here.
          setSubscribing(false)
          setError(error && error.error && error.error.decline_code)
        })
    )
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

  function createSubscription({ paymentMethodId }) {
    const priceId = productSelected.name.toUpperCase()
    const bodyParams = {
      paymentMethodId,
      priceId,
      customerId: customer.id,
    }
    // TODO: Makes a refactor of this return
    return (
      // apiRequest return the response in JSON format
      apiRequest(`${URL}/stripe/create-subscription`, 'POST', bodyParams)
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer
            throw result
          }
          return result
        })
        // Normalize the result to contain the object returned
        // by Stripe. Add the addional details we need.
        .then((result) => {
          return {
            // Use the Stripe 'object' property on the
            // returned result to understand what object is returned.
            subscription: result,
            paymentMethodId: paymentMethodId,
            priceId: productSelected.name,
          }
        })
        // Some payment methods require a customer to do additional
        // authentication with their financial institution.
        // Eg: 2FA for cards.
        .then(handlePaymentCustomerAction)
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail. You will
        // get a requires_payment_method error.
        .then(handleRequiresPaymentMethod)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .catch((error) => {
          console.log(error)
          // An error has happened. Display the failure to the user here.
          // We utilize the HTML element we created.
          setSubscribing(false)
          setError(error.message || error.error.decline_code)
        })
    )
    // )
  }

  // Register new user after subscription
  // TODO: Extract this function into new file
  async function createUser({ firstname, userName, password }) {
    const bodyParams = {
      firstname,
      userName,
      password,
    }

    console.log('[BODY_PARAMS]')
    console.log(bodyParams)

    try {
      const { data: user } = await axios.post(`${URL}/auth/signup`, bodyParams)

      if (!user.auth) {
        console.log('Cannot register user')
        return
      }

      Auth.setToken(user.token)

      const { data: me } = await axios.get(`${URL}/auth/me`, {
        headers: {
          'x-access-token': user.token,
        },
      })

      setUserData(me.user)
      setUserCreated(true)
    } catch (e) {
      throw new Error(e)
    }
  }

  const handleSubmit = async (e) => {
    // Block native form submission.
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
        setError(error && error.message)
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
        createUser({
          firstname: formState.firstname,
          userName: formState.email,
          password: formState.password,
        })
      }

      setSent()
    } catch (err) {
      console.log(err)
      throw new TypeError(err)
    }
  }

  const handleChange = ({ currentTarget: { name, value } }) =>
    updateFormState({ [name]: value })

  if (accountInformation && userCreated) {
    temp = { ...accountInformation, user: userData }
  }

  if (accountInformation && userCreated && load) {
    console.log('[Account Information]', accountInformation)
    // const temp = { ...accountInformation, user: userData }

    sessionStorage.setItem(
      'paymentMethodId',
      accountInformation.paymentMethodId,
    )
    return (
      <Redirect
        to={{
          pathname: '/account',
          // FIXME: Delete state and use useData
          state: { accountInformation: temp },
        }}
      />
    )
  } else {
    return (
      <div className="payment">
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
            value={formState.firstname}
            placeholder="First name"
            onChange={handleChange}
            required
          />
          <input
            className="payment__input"
            type="text"
            id="lastname"
            name="lastname"
            value={formState.lastname}
            placeholder="Last name"
            onChange={handleChange}
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
            <div className="payment__form-error">{error ? error : null}</div>
          </div>
          <div className="payment__secure">
          <img className="payment__secure-lock" src={Logo} alt="Footer logo" />
            Server is secure
          </div>
          <button className="payment__button" type="submit">
            {subscribing ? 'Subscribing...' : 'Subscribe to Edu-zone'}
          </button>
        </form>
        <p className="payment__text-down">
          By clicking "Subscribe to Edu-zone", you are confirming that you have
          read and accept our Terms of Service. You also agree that IXL will
          save your card details in order to automatically renew your
          subscription and process future account updates. If we change in any
          way the way we use the data we store from your card, we will notify
          you using the email address you provided. This site is protected by
          reCAPTCHA and subject to Google's Privacy Policy and Terms of Service.
        </p>
      </div>
    )
  }
}

const PaymentForm = (props) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
)

export default PaymentForm
