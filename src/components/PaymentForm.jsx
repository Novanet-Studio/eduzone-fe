import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Redirect } from 'react-router-dom'
import { apiRequest, fetchData, URL } from '../utils'
import './PaymentForm.scss'

const { SNOWPACK_PUBLIC_STRIPE_PK } = import.meta.env

// Load stripe with Public Key
const stripePromise = loadStripe(SNOWPACK_PUBLIC_STRIPE_PK)

if (!SNOWPACK_PUBLIC_STRIPE_PK) {
  console.error('**Stripe publishable key invironment variable not set**')
  console.error('**Add an environment variable SNOWPACK_PUBLIC_STRIPE_PK**')
  console.error('**Or replace .env.example with .env **')
}

const CheckoutForm = ({ productSelected, customer, formData }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [firstName, setFirstName] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [accountInformation, setAccountInformation] = useState(null)
  const [userCreated, setUserCreated] = useState(false)
  const [error, setError] = useState('')

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

    setAccountInformation(result)
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
    // return (
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
  async function createUser({ firstname, userName, password }) {
    const bodyParams = {
      firstname,
      userName,
      password,
    }

    console.log('[BODY_PARAMS]')
    console.log(bodyParams)

    try {
      const response = await fetchData(
        `${URL}/api/auth/signup`,
        'POST',
        bodyParams,
      )

      if (response.statusCode === 200) {
        localStorage.setItem('auth', response.data.token)
        setUserCreated(true)
      }
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
      createSubscription({
        paymentMethodId: paymentMethodId,
      })

      console.log('[FORM_DATA]')
      console.log(formData)

      createUser({
        firstname: firstName,
        userName: formData.email,
        password: formData.password,
      })
    } catch (err) {
      console.log(err)
      throw new TypeError(err)
    }
  }

  const handleChange = ({ target }) => setFirstName(target.value)

  if (accountInformation && userCreated) {
    console.log('[Account Information]', accountInformation)
    sessionStorage.setItem(
      'paymentMethodId',
      accountInformation.paymentMethodId,
    )
    return (
      <Redirect
        to={{
          pathname: '/account',
          state: { accountInformation },
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
            name={firstName}
            placeholder="First and last name"
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
            <label>Card</label>
            <div className="payment__form-element">
              <CardElement
                options={{}}
              />
            </div>
            <div className="payment__form-error">{error ? error : null}</div>
          </div>
          <button className="payment__button" type="submit">
            {subscribing ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
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
