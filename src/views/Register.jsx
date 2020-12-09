import React, { useEffect, useRef, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import TopNavigationBar from '../components/TopNavigationBar'
import Footer from '../components/Footer'
import { fetchData, URL } from '../utils'

const styles = {
  form: {
    padding: 20,
    width: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    boxShadow: '1px 1px 10px rgba(0,0,0,.2)',
  },
  title: { textAlign: 'center' },
  input: {
    margin: '10px 0',
  },
  button: {
    marginTop: 10,
  },
}

const initialState = {
  email: '',
  password: '',
}

function Register() {
  const [state, setState] = useState(initialState)
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(false)
  const _isMounted = useRef(true)
  let formData = useRef(null)

  useEffect(() => {
    return () => _isMounted.current = false
  }, [])

  const handleChange = ({ target }) => 
    setState({ ...state, [target.name]: target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    formData.current = state
    setLoading(true)
    try {

      if (_isMounted.current) {
        const response = await fetchData(
          'http://localhost:3000/api/auth/verify',
          'POST',
          { email: state.email }
        )
  
        if (response.exists) {
          setLoading(false)
          console.log('User already exists')
          return
        }
  
        const result = await fetchData(`${URL}/stripe/create-customer`, 'POST', {
          email: state.email,
        })
        console.log('creating a new customer');
        setCustomer(result.customer)
        setLoading(false)
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  if (customer) {
    return (
      <Redirect
        to={{
          pathname: '/prices',
          state: { customer, formData: formData.current },
        }}
      />
    )
  } else {
    return (
      <>
        <TopNavigationBar loggedIn={false} />
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            id="email"
            name="email"
            style={styles.input}
            value={state.email}
            onChange={handleChange}
            placeholder="Email address"
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            style={styles.input}
            value={state.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Loading...' : 'Next'}
          </button>
        </form>
        <p>
          You have an account? <Link to="/">login</Link>
        </p>
        <Footer />
      </>
    )
  }
}

export default Register
