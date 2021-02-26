import { useRef, useState } from 'react'
import { Link, Prompt } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ErrorMessage as ErrorFormMessage } from '@hookform/error-message'

import { Header, Footer } from '@layout'

import ErrorMessage, { ErrorMessageContainer } from '@components/ErrorMessage'
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
  const { register, errors, handleSubmit } = useForm()
  const [productSelected, setProductSelected] = useState(sessionProduct || null)
  const [input, setInput] = useState(null)
  const [error, showError] = useError()
  const btnSubmit = useRef()

  const isTyping = () =>
    email.isTyping || password.isTyping || confirmPassword.isTyping

  const handleClick = (key) => {
    sessionStorage.setItem('eduzone::product', JSON.stringify(products[key]))
    setProductSelected(products[key])
  }

  window.scrollTo({ top: 0 })

  const handleFormSubmit = (e) => setInput(e)
  
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
            <form className="register__form" onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="register__form-control">
                <input
                  className="register__input"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  autoFocus
                  ref={register({
                    required: { value: true, message: 'You must enter your email' },
                    pattern: { value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, message: 'Email not valid' }
                  })}
                />
                <ErrorFormMessage
                  errors={errors}
                  name="email"
                  as={<ErrorMessageContainer />}
                />
              </div>
              <div className="register__form-control">
                <input
                  className="register__input"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  ref={register({
                    required: { value: true, message: 'You must enter a password'},
                    minLength: {
                      value: 6,
                      message: 'Your password must be at least 6 characters',
                    },
                    maxLength: {
                      value: 20,
                      message: 'The password must be between 6 and 20 characters'
                    }
                  })}
                />
                <ErrorFormMessage
                  errors={errors}
                  name="password"
                  as={<ErrorMessageContainer />}
                />
              </div>
              <div className="register__form-control">
                <input
                  className="register__input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Password confirmation"
                  onBlur={() => {
                    btnSubmit.current.click()
                  }}
                  ref={register({
                    required: { value: true, message: 'You must enter a confirm password'},
                    minLength: {
                      value: 6,
                      message: 'Your confirm password must be at least 6 characters',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Your confirm password must be between 6 and 20 characters'
                    }
                  })}
                />
                <ErrorFormMessage
                  errors={errors}
                  name="confirmPassword"
                  as={<ErrorMessageContainer />}
                />
              </div>
              <input type="submit" ref={btnSubmit} hidden />
            </form>
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
                input={input}
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
