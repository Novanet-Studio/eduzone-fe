import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import axios from 'axios'
// import Signup from './components/Signup'


import Image from './assets/keyboard.jpeg'
import './App.css'

const stripePromise = loadStripe(
  'pk_test_51HrYUuDQxWpdMrSvs5C2SVJsaod3aSGLMeNXgAl098S0Z6KXjwsH8L7cLcltwurqO6M25L6hgFNN5r0xjnM35xUM00HGQYzaxj',
)

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })

    if (!error) {
      const { id } = paymentMethod

      try {
        const { data } = await axios.post(
          'http://localhost:3000/api/checkout',
          {
            id,
            amount: 10 * 100, // Centavos
          },
        )

        console.log(data)
        elements.getElement(CardElement).clear()
      } catch (e) {
        console.log(e)
      }

      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <img src={Image} className="card__image" alt="teclado mecanico" />
      <h3 className="card__title">Price: $100</h3>
      <CardElement className="card__group" />
      <button className="card__button" disabled={!stripe}>
        {loading ? '...loading' : 'Pay'}
      </button>
    </form>
  )
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container">
        <CheckoutForm />
      </div>
    </Elements>
  )
}

export default App
