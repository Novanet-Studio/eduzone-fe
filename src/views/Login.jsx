import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { fetchData } from '../utils'

const initialState = {
  email: '',
  password: '',
}

function Login() {
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [data, setData] = useState({})

  const handleChange = ({ target }) =>
    setState({ ...state, [target.name]: target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await fetchData('http://localhost:3000/api/auth/signin', 'POST', {
      userName: state.email,
      password: state.password,
    })

    const response = await fetchData(
      'http://localhost:3000/api/auth/signin',
      'POST',
      { userToken: result.token },
    )

    localStorage.setItem('auth', response.data.token)

    setData(response.data)

    setIsAuth(true)

    console.log(response)
    setLoading(false)
  }

  if (isAuth) {
    return (
      <Redirect
        to={{
          pathname: '/success',
          state: {
            isAuth,
            data
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
