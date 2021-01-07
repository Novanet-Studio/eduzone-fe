import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Auth, fetchData, URL } from '../utils'
import Footer from '../components/Footer'
import './Login.scss'

const initialState = {
  email: '',
  password: '',
}

function Login() {
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [userLoaded, setUserLoaded] = useState(false)
  const [accountInformation, setAccountInformation] = useState({})

  useEffect(() => {
    console.log('Loading user again ...')
    async function loadUser() {
      const token = Auth.getToken
      if (!token) {
        setLoadingUser(false)
        console.log('exit')
        return
      }

      if (userLoaded) {
        setLoading(false)
        console.log('Is loaded')
        return
      }

      try {
        const response = await fetch(`${URL}/api/auth/me`, {
          headers: {
            'x-access-token': String(token),
          },
        })
        const result = await response.json()
        setAccountInformation({ ...result })
        setLoadingUser(false)
        setIsAuth(true)
        setUserLoaded(true)
      } catch (err) {
        console.log(err)
      }
    }

    loadUser()
  }, [])

  const handleChange = ({ target }) =>
    setState({ ...state, [target.name]: target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await fetchData(`${URL}/api/auth/signin`, 'POST', {
      userName: state.email,
      password: state.password,
    })

    if (!result.auth) {
      console.log(result.message)
      setLoading(false)
      return
    }

    console.log('[LOGING USER]', result.token)
    Auth.setToken(result.token)

    setAccountInformation({ ...result })

    setLoading(false)
    setIsAuth(true)
  }

  if (isAuth) {
    console.log(accountInformation.paymentMethodId)
    return (
      <Redirect
        to={{
          pathname: '/account',
          state: {
            isAuth,
            accountInformation,
          },
        }}
      />
    )
  }

  if (!loadingUser) {
    return (
      <>
      <section className="login">
        <div className="container">
          <div className="login__info">
            <h2 className="login__title">Login</h2>
            <form className="login__form" onSubmit={handleSubmit}>
              <input
                className="login__input"
                type="email"
                name="email"
                id="email"
                placeholder="Email address"
                value={state.email}
                onChange={handleChange}
              />
              <input
                className="login__input"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={state.password}
                onChange={handleChange}
              />
              <button className="login__button">
                {loading ? 'loading...' : 'Login'}
              </button>
            </form>
            <p className="login__text">
              You don't have an account yet? <Link className="login__register" to="/register">register</Link>
            </p>
          </div>
        </div>
      </section>
              <Footer />
              </>
    )
  } else {
    ;<section className="loading">
      <p>Loading ...</p>
    </section>
  }
}

export default Login