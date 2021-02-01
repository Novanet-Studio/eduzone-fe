import { useEffect, useRef, useState } from 'react'
import { Link, Prompt, useHistory, useLocation } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import ErrorMessage from '../components/ErrorMessage'
import useError from '../hooks/useError'
import { useGlobal } from '../context/globalContext'
import { useAccount } from '../hooks/useAccount'
import { checkUserExists, createCustomer } from '../helpers/register'
import './Register.scss'

function Register() {
  const history = useHistory()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const { error, showError } = useError(null)
  const { accountInformation, updateAccountInformation } = useAccount()
  const {
    formState,
    setIsTyping,
    setInitialFormState,
    handleTypingChange,
    changeLocation,
  } = useGlobal()
  const _isMounted = useRef(true)

  if (location.state && location.state.transition) {
    setInitialFormState()
    location.state.transition = false
  }

  useEffect(() => {
    return () => (_isMounted.current = false)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsTyping(false)
    setLoading(true)
    try {
      if (!_isMounted.current) return
      let { email, password, confirmPassword } = formState

      if (password !== confirmPassword) {
        console.log('Passwords not match')
        password = ''
        confirmPassword = ''
        showError('Passwords not match')
        setLoading(false)
        return
      }

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
      updateAccountInformation('customer', customerCreated)
      setLoading(false)
    } catch (error) {
      console.log({ error })
      console.log(error.response.data.message)
      setLoading(false)
      showError(error.response.data.message)
    }
  }

  if (accountInformation.customer) {
    history.push('/prices')
  }

  return (
    <>
      <Prompt message={changeLocation} />
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
                onChange={handleTypingChange}
                placeholder="Email address"
                required
              />
              <input
                className="register__input"
                type="password"
                id="password"
                name="password"
                value={formState.password}
                minLength="6"
                maxLength="20"
                onChange={handleTypingChange}
                placeholder="Enter password"
                required
              />
              <input
                className="register__input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formState.confirmPassword}
                minLength="6"
                maxLength="20"
                onChange={handleTypingChange}
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
