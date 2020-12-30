import React, { useEffect, useRef, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { fetchData, URL } from '../utils'

const initialState = {
  email: '',
  password: '',
}

function Register() {
  const [state, setState] = useState(initialState)
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(false)
  const _isMounted = useRef(true)
  let formData = useRef(null)

  useEffect(() => {
    return () => (_isMounted.current = false)
  }, [])

  const handleChange = ({ target }) =>
    setState({ ...state, [target.name]: target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    formData.current = state
    setLoading(true)
    try {
      if (_isMounted.current) {
        const response = await fetchData(`${URL}/api/auth/verify`, 'POST', {
          email: state.email,
        })

        if (response.exists) {
          setLoading(false)
          console.log('User already exists')
          return
        }

        const result = await fetchData(
          `${URL}/stripe/create-customer`,
          'POST',
          {
            email: state.email,
          },
        )
        console.log('creating a new customer')
        setCustomer(result.customer)
        setLoading(false)
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  if (customer) {
    return (
      <Redirect
        to={{
          pathname: '/prices',
          state: { customer, formData: formData.current },
        }}
      />
    )
  } else {
    return (
      <>
        <Header loggedIn={false} />
        <section className="register">
          <div className="container">
            <h2 className="register__title">Register</h2>
            <form className="register__form" onSubmit={handleSubmit}>
              <input
                className="register__input"
                type="text"
                id="email"
                name="email"
                value={state.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
              <input
                className="register__input"
                type="password"
                id="password"
                name="password"
                value={state.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
              <button
                className="register__button"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Next'}
              </button>
            </form>
            <p className="register__login">
              You have an account? <Link to="/">login</Link>
            </p>
          </div>
        </section>
        <Footer />
      </>
    )
  }
}

export default Register
