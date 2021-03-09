import axios from 'axios'
import { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'

import Layout from '../../layout/Layout'

import { useError } from '@hooks'
import ErrorMessage, { ErrorMessageContainer } from '@components/ErrorMessage'
import {
  setAccount,
  setToken,
  setUserLicense,
  setUserSession,
} from '@utils/common'
import { URL } from '@constants'
import { useForm } from 'react-hook-form'
import { ErrorMessage as ErrorFormMessage } from '@hookform/error-message'
import './Login.scss'

function Login() {
  const { register, handleSubmit, errors } = useForm()
  const history = useHistory()
  const [error, showError] = useError(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    const { email, password } = e
    setLoading(true)
    const signinParams = {
      userName: email,
      password: password,
    }
    try {
      const { data } = await axios.post(`${URL}/auth/signin`, signinParams)
      setToken(data.token)

      const { data: me } = await axios.get(`${URL}/auth/me`)
      const { priceId, paymentMethodId, subscription, user, license } = me

      setUserLicense(license)
      setUserSession(user)
      setAccount({
        priceId,
        paymentMethodId,
        subscription,
      })
      setLoading(false)
      history.push('/account')
    } catch (error) {
      setLoading(false)
      console.log({ error })

      if (error.response.status === 401) {
        showError(error.response.data.message)
      }

      showError('Somenthing went wrong. Please try again later.')
    }
  }

  return (
    <Layout>
      
      <section className="login">
        <div className="container">
          <div className="login__info">
            <h2 className="login__title">Login</h2>
            <form className="login__form" onSubmit={handleSubmit(handleLogin)}>
              <div className="login__form-control">
                <input
                  className="input login__input"
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  ref={register({
                    required: {
                      value: true,
                      message: 'You must enter your email',
                    },
                    pattern: {
                      value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                      message: 'Email not valid',
                    },
                  })}
                />
                <ErrorFormMessage
                  errors={errors}
                  name="email"
                  as={<ErrorMessageContainer />}
                />
                <input
                  className="input login__input"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  ref={register({
                    required: {
                      value: true,
                      message: 'You must enter a password',
                    },
                    minLength: {
                      value: 6,
                      message: 'Your password must be at least 6 characters',
                    },
                  })}
                />
                <ErrorFormMessage
                  errors={errors}
                  name="password"
                  as={<ErrorMessageContainer />}
                />
                <button className="button login__button" disabled={loading}>
                  {loading ? 'Loading...' : 'Login'}
                </button>
                {error && <ErrorMessage error={error} />}
              </div>
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
    </Layout>
  )
}

export default Login
