import { useState } from 'react'
import { Link, Prompt, useHistory } from 'react-router-dom'

import { Header, Footer } from '../layout'

import { ErrorMessage } from '../components/share'
import { useError, useFormInput } from '../hooks'
import { checkUserExists, createCustomer } from '../helpers/register'
import { setUserCredentials } from '../utils/common'
import './Register.scss'

function Register() {
  const history = useHistory()
  const email = useFormInput('')
  const password = useFormInput('')
  const confirmPassword = useFormInput('')
  const [loading, setLoading] = useState(false)
  const [error, showError] = useError()

  const isTyping = () =>
    email.isTyping || password.isTyping || confirmPassword.isTyping

  const resetInput = () => {
    email.reset()
    password.reset()
    confirmPassword.reset()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (password.value !== confirmPassword.value) {
        password.reset()
        confirmPassword.reset()
        showError('Passwords not match')
        setLoading(false)
        return
      }

      const exists = await checkUserExists(email.value)
      if (exists) {
        setLoading(false)
        showError('User already exists')
        return
      }

      const customer = await createCustomer(email.value)
      setLoading(false)
      // Set in sessionStorage to send to create user
      setUserCredentials(email.value, password.value)
      resetInput()
      setLoading(false)
      history.push('/prices', { customer })
    } catch (error) {
      resetInput()
      setLoading(false)
      showError(error.response.data.message)
    }
  }

  return (
    <>
      <Prompt
        when={isTyping()}
        message="Are you secure do you want to leave?"
      />
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
                placeholder="Email address"
                value={email.value}
                onChange={email.onChange}
                required
              />
              <input
                className="register__input"
                type="password"
                id="password"
                name="password"
                minLength="6"
                maxLength="20"
                placeholder="Enter password"
                value={password.value}
                onChange={password.onChange}
                required
              />
              <input
                className="register__input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                minLength="6"
                maxLength="20"
                placeholder="Password confirmation"
                value={confirmPassword.value}
                onChange={confirmPassword.onChange}
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
