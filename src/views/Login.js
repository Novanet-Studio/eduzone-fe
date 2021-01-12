import axios from 'axios'
import { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import useLogin from '../hooks/useLogin'
import { useGlobal } from '../context/globalContext'

import Footer from '../components/Footer'
import { Auth, URL } from '../utils'
import './Login.scss'


function Login() {
  const { formState, updateFormState } = useGlobal()
  const [loading, setLoading] = useState(false)
  // TODO: Analize if this state could be change into new state or
  // existing state of useGlobal
  const [accountInformation, setAccountInformation] = useState({})
  const { setIsAuth, isAuth, loadingUser, userInfo } = useLogin()

  const handleChange = ({currentTarget:{ name, value }}) => updateFormState({ [name]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const bodyParams = {
      userName: formState.email,
      password: formState.password,
    }

    try {
      
      const { data, status } = await axios.post(`${URL}/auth/signin`, bodyParams)
      Auth.setToken(data.token)

      if (status === 200) {
        const { data } = await axios.get(`${URL}/auth/me`, {
          headers: {
            'x-access-token': Auth.getToken
          }
        })
  
        console.log(data)
        setAccountInformation({ user: data.user })
        setLoading(false)
        setIsAuth(true)
      }

    } catch (error) {
      console.log({ error })
      console.log(error.response.data.message)
      setLoading(false)
    }
  }

  if (isAuth) {
    console.log(accountInformation.paymentMethodId)
    let temp = accountInformation.user 
      ? accountInformation
      : { ...accountInformation, user: userInfo }

      return (
      <Redirect
        to={{
          pathname: '/account',
          state: {
            // Use isAuth throw useGlobal hook
            isAuth,
            accountInformation: temp,
          },
        }}
      />
    )
  }

  // FIXME: check for true value
  if (loadingUser) {
    return (
      <section className="loading">
        <p>Loading ...</p>
      </section>
    )
  }

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
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className="login__input"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={formState.password}
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
  // if (!loadingUser) {
    
  // } else {
  //   ;<section className="loading">
  //     <p>Loading ...</p>
  //   </section>
  // }
}

export default Login