import axios from 'axios'
import { useState } from 'react'
import { Link, useHistory, Prompt, useLocation } from 'react-router-dom'

import Auth from '../helpers/auth'
import Footer from '../components/Footer'
import useError from '../hooks/useError'
import ErrorMessage from '../components/ErrorMessage'
import { URL } from '../constants'
import { useGlobal } from '../context/globalContext'
import { useAccount } from '../hooks/useAccount'
import './Login.scss'

function Login() {
  const history = useHistory()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(false)
  const { error, showError } = useError(null)
  const { updateAll } = useAccount()
  const {
    formState,
    setIsTyping,
    setInitialFormState,
    handleTypingChange,
    changeLocation,
  } = useGlobal()

  if (location.state && location.state.transition) {
    setInitialFormState()
    location.state.transition = false
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsTyping(false)
    setLoading(true)

    const bodyParams = {
      userName: formState.email,
      password: formState.password,
    }

    try {
      const { data: response, status } = await axios.post(
        `${URL}/auth/signin`,
        bodyParams,
      )
      if (status === 200) {
        Auth.setToken(response.token)
        const { data } = await axios.get(`${URL}/auth/me`)

        updateAll(data)
        localStorage.setItem('auth', data.auth)
        setLoading(false)
        setUser(true)
      }
    } catch (error) {
      setLoading(false)
      showError(error.response.data.message)
    }
  }

  if (user) {
    history.push('/account')
  }

  return (
    <>
      <Prompt message={changeLocation} />
      <section className="login">
        <div className="container">
          <div className="login__info">
            <h2 className="login__title">Login</h2>
            {error && <ErrorMessage errorMessage={error} />}
            <form className="login__form" onSubmit={handleSubmit}>
              <input
                className="login__input"
                type="email"
                name="email"
                id="email"
                placeholder="Email address"
                value={formState.email}
                onChange={handleTypingChange}
              />
              <input
                className="login__input"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={formState.password}
                onChange={handleTypingChange}
              />
              <button className="login__button">
                {loading ? 'loading...' : 'Login'}
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
