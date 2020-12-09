import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

import axios from 'axios'

import './App.css'

const stripePromise = loadStripe(
  'pk_test_51HrYUuDQxWpdMrSvs5C2SVJsaod3aSGLMeNXgAl098S0Z6KXjwsH8L7cLcltwurqO6M25L6hgFNN5r0xjnM35xUM00HGQYzaxj',
)

// CheckoutSession
const CheckoutSession = () => {
  const stripe = useStripe()
  const createCheckoutSession = (priceId) => {
    return fetch('http://localhost:4242/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ priceId })
    }).then(result => result.json())
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    createCheckoutSession()
  }

  return (
    <button id="checkout" onSubmit={handleSubmit}>
      Subscribe
    </button>
  )
}

function App() {
  return (
    <div className="container">
      <CheckoutSession />
    </div>
  )
}

export default App