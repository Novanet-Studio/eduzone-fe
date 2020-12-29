import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { fetchData, URL } from '../utils'

const initialState = {
  email: '',
  password: '',
}

function Login() {
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [accountInformation, setAccountInformation] = useState({})

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

    localStorage.setItem('auth', result.auth)
    localStorage.setItem('token', result.token)

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

  return (
    <section className="login">
      <div className="container">
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
            {loading ? '...loading' : 'Login'}
          </button>
        </form>
        <p className="login__register">
          You don't have an account yet? <Link to="/register">register</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
