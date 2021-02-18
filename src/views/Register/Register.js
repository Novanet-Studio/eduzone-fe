import { useState } from 'react'
import { Link, Prompt } from 'react-router-dom'

import { Header, Footer } from '@layout'

import ErrorMessage from '@components/ErrorMessage'
import { useError, useFormInput } from '@hooks'
import { products } from '@constants'
import Product from '@components/Product'
import PaymentForm from './components/PaymentForm'
import './Register.scss'

function Register() {
  const sessionEmail = sessionStorage.getItem('email') || null
  const sessionProduct = JSON.parse(sessionStorage.getItem('eduzone::product'))
  const email = useFormInput(sessionEmail || '')
  const password = useFormInput('')
  const confirmPassword = useFormInput('')
  const [productSelected, setProductSelected] = useState(sessionProduct || null)
  const [error, showError] = useError()

  const isTyping = () =>
    email.isTyping || password.isTyping || confirmPassword.isTyping

  const handleClick = (key) => {
    sessionStorage.setItem('eduzone::product', JSON.stringify(products[key]))
    setProductSelected(products[key])
  }

  return (
    <>
      <Prompt
        when={isTyping()}
        message="Are you secure do you want to leave?"
      />
      <Header loggedIn={false} />
      <section className="register">
        <div className="container">
          <div className="register__info">
            <h2 className="register__title">Register</h2>
            <p className="register__text">
                You have an account?{' '}
                <Link className="register__login" to="/login">
                  Login
                </Link>
              </p>
            {error && <ErrorMessage error={error} />}
            <section className="register__form">
              <input
                className="register__input"
                type="text"
                id="email"
                name="email"
                placeholder="Email address"
                value={email.value}
                onChange={email.onChange}
                required
              />
              {/* <p className="register__password">
                The password must be at least 6 characters. The password must be
                between 6 and 20 characters.
              </p> */}
              <input
                className="register__input"
                type="password"
                id="password"
                name="password"
                minLength="6"
                maxLength="20"
                placeholder="Enter password"
                value={password.value}
                onChange={password.onChange}
                required
              />
              <input
                className="register__input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                minLength="6"
                maxLength="20"
                placeholder="Password confirmation"
                value={confirmPassword.value}
                onChange={confirmPassword.onChange}
                required
              />
              <p className="register__text">
                The password must be at least 6 characters. The password must be
                between 6 and 20 characters.
              </p>
            </section>
            <section className="plan">
              <h2 className="plan__title">Choose a plan</h2>
              <div className="products">
                {products.map((product) => (
                  <Product
                    key={product.key}
                    product={product}
                    currentProductSelected={productSelected}
                    handleClick={handleClick}
                  />
                ))}
              </div>
            </section>
            {productSelected && (
              <PaymentForm
                productSelected={productSelected}
                showError={showError}
                input={{
                  email,
                  password,
                  confirmPassword,
                }}
              />
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Register
