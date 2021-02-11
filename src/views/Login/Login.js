import axios from 'axios'
import { useState } from 'react'
import { useHistory, Link, Prompt } from 'react-router-dom'

import { Footer } from '../../layout'

import ErrorMessage from '../../components/ErrorMessage'
import { useError, useFormInput } from '../../hooks'
import { setAccount, setToken, setUserSession } from '../../utils/common'
import { URL } from '../../constants'
import './Login.scss'

function Login() {
  const history = useHistory()
  const email = useFormInput('')
  const password = useFormInput('')
  const [error, showError] = useError()
  const [loading, setLoading] = useState(false)

  const isTyping = () => email.isTyping || password.isTyping

  const resetInput = () => {
    email.reset()
    password.reset()
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const signinParams = {
      userName: email.value,
      password: password.value,
    }
    try {
      const { data } = await axios.post(`${URL}/auth/signin`, signinParams)
      setToken(data.token)

      const { data: me } = await axios.get(`${URL}/auth/me`)
      const { priceId, paymentMethodId, subscription, user } = me

      setUserSession(user)
      setAccount({
        priceId,
        paymentMethodId,
        subscription,
      })
      setLoading(false)
      resetInput()
      history.push('/account')
    } catch (error) {
      setLoading(false)
      console.log({ error })

      if (error.response.status === 401) {
        showError(error.response.data.message)
      }

      showError('Somenthing went wrong. Please try again later.')
      resetInput()
    }
  }

  return (
    <>
      <Prompt
        when={isTyping()}
        message="Are you secure do you want to leave?"
      />
      <section className="login">
        <div className="container">
          <div className="login__info">
            <h2 className="login__title">Login</h2>
            {error && <ErrorMessage error={error} />}
            <form className="login__form" onSubmit={handleLogin}>
              <input
                className="login__input"
                type="email"
                name="email"
                id="email"
                placeholder="Email address"
                autoComplete="new-email"
                value={email.value}
                onChange={email.onChange}
              />
              <input
                className="login__input"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                autoComplete="new-password"
                value={password.value}
                onChange={password.onChange}
              />
              <button className="login__button" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
            <p className="login__text">
              You don't have an account yet?{' '}
              <Link className="login__register" to="/register">
                register
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Login
