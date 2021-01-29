import { useEffect, useRef, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import ErrorMessage from '../components/ErrorMessage'

import useError from '../hooks/useError'
import { useGlobal } from '../context/globalContext'
import { checkUserExists, createCustomer } from '../helpers/register'

import './Register.scss'

function Register() {
  const [customer, setCustomer] = useState(null)
  const { error, showError } = useError(null)
  const [loading, setLoading] = useState(false)
  const { formState, updateFormState } = useGlobal()
  const _isMounted = useRef(true)

  useEffect(() => {
    return () => (_isMounted.current = false)
  }, [])

  const handleChange = ({ currentTarget: el }) =>
    updateFormState({ [el.name]: el.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!_isMounted.current) return
      const { email } = formState
      const exists = await checkUserExists(email)
      console.log(exists)
      if (exists) {
        setLoading(false)
        console.log('User already exists')
        showError('User already exists')
        return
      }

      const customerCreated = await createCustomer(email)
      console.log('creating a new customer')
      setCustomer(customerCreated)
      setLoading(false)
    } catch (error) {
      console.log({ error })
      console.log(error.response.data.message)
      showError(error.response.data.message)
      setLoading(false)
      // throw new Error(error.message)
    }
  }

  if (customer) {
    return (
      <Redirect
        to={{
          pathname: '/prices',
          state: { customer },
        }}
      />
    )
  }

  return (
    <>
      <Header loggedIn={false} />
      <section className="register">
        <div className="container">
          <div className="register__info">
            <h2 className="register__title">Register</h2>
            {error && <ErrorMessage errorMessage={error} />}
            <form className="register__form" onSubmit={handleSubmit}>
              <input
                className="register__input"
                type="text"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
              <input
                className="register__input"
                type="password"
                id="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
              <input
                className="register__input"
                type="confirmation"
                id="confirmation"
                name="confirmation"
                placeholder="Password confirmation"
                required
              />
              <p className="register__password">
                The password must be at least 6 characters. The password must be
                between 6 and 20 characters.
              </p>
              <button
                className="register__button"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Next'}
              </button>
            </form>
            <p className="register__text">
              You have an account?{' '}
              <Link className="register__login" to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Register
