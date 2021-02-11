import axios from 'axios'
import { URL } from '../constants'

const handlePaymentCustomerAction = async ({
  subscription,
  invoice,
  priceId,
  paymentMethodId,
  isRetry,
  stripe,
}) => {
  console.log('[handlePaymentCustomerAction]', {
    subscription,
    invoice,
    priceId,
    paymentMethodId,
    isRetry,
  })

  // if (!stripe) throw new Error('Stripe was not provided')

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

const handleRequiresPaymentMethod = ({
  subscription,
  paymentMethodId,
  priceId,
}) => {
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
    // showError('Your card was declined.')
    // setSubscribing(false)
    throw new Error('Your card was declined')
  } else {
    return { subscription, priceId, paymentMethodId }
  }
}

const onSubscriptionComplete = (result) => {
  console.log('[onSubscriptionComplete]', result)
  // Payment was successful. Provision access to your service.
  // Remove invoice from localstorage because payment is now complete.
  // clearCache();
  if (result && !result.subscription) {
    const subscription = { id: result.invoice.subscription }
    result.subscription = subscription
    localStorage.clear()
  }

  // setAccountInformation(result)
  return { subscriptionComplete: true, data: result }
  // Change your UI to show a success message to your customer.
  // onSubscriptionSampleDemoComplete(result);
  // Call your backend to grant access to your service based on
  // the product your customer subscribed to.
  // Get the product by using result.subscription.price.product
}

export const createSubscription = async ({
  paymentMethodId,
  productSelected,
  customerId,
  stripe,
}) => {
  const priceId = productSelected.type.toUpperCase()
  const bodyParams = {
    paymentMethodId,
    priceId,
    customerId,
  }
  try {
    const { data } = await axios.post(
      `${URL}/stripe/create-subscription`,
      bodyParams,
    )

    const result = {
      paymentMethodId,
      subscription: data,
      priceId: productSelected.type,
      stripe,
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
    throw error
  }
}

export const retryInvoiceWithNewPaymentMethod = async ({
  paymentMethodId,
  invoiceId,
  priceId,
  customerId,
  stripe,
}) => {

  const bodyParams = {
    paymentMethodId,
    invoiceId,
    customer: customerId,
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
      stripe,
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
    // throw new Error(error)
    throw error
    // setSubscribing(false)
    // showError(error && error.error && error.error.decline_code)
  }
}
