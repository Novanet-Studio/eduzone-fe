import { useEffect, useRef, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'

import { useGlobal } from '../context/globalContext'
import { checkUserExists, createCustomer } from '../helpers/register'

import './Register.scss'

function Register() {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(false)
  const { formState, updateFormState } = useGlobal()
  const _isMounted = useRef(true)

  useEffect(() => {
    return () => (_isMounted.current = false)
  }, [])

  const handleChange = ({ currentTarget: el }) =>
    updateFormState({ [el.name]: el.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!_isMounted.current) return
      const { email } = formState
      const exists = await checkUserExists(email)
      console.log(exists);
      if (exists) {
        setLoading(false)
        console.log('User already exists')
        return
      } 

      const customerCreated = await createCustomer(email)
      console.log('creating a new customer')
      setCustomer(customerCreated)
      setLoading(false)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  if (customer) {
    return (
      <Redirect
        to={{
          pathname: '/prices',
          state: { customer },
        }}
      />
    )
  }

  return (
    <>
      <Header loggedIn={false} />
      <section className="register">
        <div className="container">
          <div className="register__info">
            <h2 className="register__title">Register</h2>
            <form className="register__form" onSubmit={handleSubmit}>
              <input
                className="register__input"
                type="text"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="Email address"
                required
              />
              <input
                className="register__input"
                type="password"
                id="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
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
              <Link className="register__login" to="/">
                login
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
