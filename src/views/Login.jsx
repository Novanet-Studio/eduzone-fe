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
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={state.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={state.password}
            onChange={handleChange}
          />
        </div>
        <button>{loading ? '...loading' : 'Login'}</button>
      </form>
      <p>
        You don't have an account yet? <Link to="/register">register</Link>
      </p>
    </div>
  )
}

export default Login
