import React, { useEffect, useRef, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { useGlobal } from '../context/globalContext'

// import { fetchData, URL } from '../utils'
import './Register.scss'
import { checkUserExists, createCustomer } from '../helpers/register'

function Register() {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(false)
  const { formState, updateFormState } = useGlobal()
  const _isMounted = useRef(true)
  // let formData = useRef(null)

  useEffect(() => {
    return () => (_isMounted.current = false)
  }, [])

  // const handleChange = ({ target }) =>
  //   setState({ ...state, [target.name]: target.value })
  const handleChange = ({ currentTarget: el }) =>
    updateFormState({ [el.name]: el.value })

  // const handleSubmit = async (e) => { e.preventDefault(); console.log('Submitting'); console.log(formState) }

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
      // Set customer data
      setCustomer(customerCreated)
      setLoading(false)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   formData.current = state
  //   setLoading(true)
  //   try {
  //     if (_isMounted.current) {
  //       const response = await fetchData(`${URL}/api/auth/verify`, 'POST', {
  //         email: state.email,
  //       })

  //       if (response.exists) {
  //         setLoading(false)
  //         console.log('User already exists')
  //         return
  //       }

  //       const result = await fetchData(
  //         `${URL}/stripe/create-customer`,
  //         'POST',
  //         {
  //           email: state.email,
  //         },
  //       )
  //       console.log('creating a new customer')
  //       setCustomer(result.customer)
  //       setLoading(false)
  //     }
  //   } catch (e) {
  //     throw new Error(e)
  //   }
  // }

  // if (customer) {
  //   return (
  //     <Redirect
  //       to={{
  //         pathname: '/prices',
  //         state: { customer, formData: formData.current },
  //       }}
  //     />
  //   )
  // } else {
  //
  // }

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
