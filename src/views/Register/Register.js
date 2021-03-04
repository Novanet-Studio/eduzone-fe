import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ErrorMessage as ErrorFormMessage } from '@hookform/error-message'

import { Header, Footer } from '@layout'

import ErrorMessage, {
  ErrorMessageContainer,
  SuccessMessage,
} from '@components/ErrorMessage'
import ScrollToTop from '@/components/ScrollToTop'
import { useError } from '@hooks'
import { products } from '@constants'
import Product from '@components/Product'
import PaymentForm from './components/PaymentForm'
import './Register.scss'

function Register() {
  const sessionEmail = sessionStorage.getItem('email') || null
  const sessionProduct = JSON.parse(sessionStorage.getItem('eduzone::product'))
  const {
    register,
    errors,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset: resetForm,
  } = useForm({ mode: 'onChange' })
  const [productSelected, setProductSelected] = useState(sessionProduct || null)
  const [input, setInput] = useState(null)
  const [error, showError] = useError()
  const btnSubmit = useRef()

  const handleClick = (key) => {
    sessionStorage.setItem('eduzone::product', JSON.stringify(products[key]))
    setProductSelected(products[key])
  }

  const handleFormSubmit = (e) => setInput(e)

  const reset = () => {
    resetForm()
    sessionStorage.removeItem('email')
  }

  const handleChange = () => {
    const values = getValues()

    if (values.email === values.confirmEmail) {
      console.log('The email inputs not match')
      clearErrors(['email', 'confirmEmail'])
    }

    if (values.password === values.confirmPassword) {
      console.log('The passwords match')
      clearErrors(['password', 'confirmPassword'])
    }

    if (values.confirmEmail) {
      if (values.email !== values.confirmEmail) {
        [
          {
            type: 'manual',
            name: 'email',
            message: 'Emails not match',
          },
          {
            type: 'manual',
            name: 'confirmEmail',
            message: 'Emails not match',
          }
        ].forEach(({ name, ...config}) => setError(name, config))
      }
    }

    if (values.confirmPassword) {
      if (values.password !== values.confirmPassword) {
        [
          {
            type: 'manual',
            name: 'password',
            message: 'Passwords no match',
          },
          {
            type: 'manual',
            name: 'confirmPassword',
            message: 'Passwords no match',
          }
        ].forEach(({ name, ...config }) => setError(name, config))
      }
    }
  }

  return (
    <>
      <ScrollToTop />
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
            <form
              className="register__form"
              onSubmit={handleSubmit(handleFormSubmit)}
              onChange={handleChange}
            >
              <div className="register__form-control">
                <input
                  className="register__input"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  autoFocus
                  defaultValue={sessionEmail || ''}
                  ref={register({
                    required: {
                      value: true,
                      message: 'You must enter your email',
                    },
                    pattern: {
                      value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                      message: 'Email not valid',
                    },
                  })}
                />
                <SuccessMessage
                  errors={errors}
                  name="email"
                  values={getValues()}
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
                  type="email"
                  name="confirmEmail"
                  placeholder="Confirm email address"
                  ref={register({
                    required: {
                      value: true,
                      message: 'Please confirm your email address',
                    },
                    pattern: {
                      value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                      message: 'Email not valid',
                    },
                  })}
                />
                <SuccessMessage
                  errors={errors}
                  name="confirmEmail"
                  values={getValues()}
                />
                <ErrorFormMessage
                  errors={errors}
                  name="confirmEmail"
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
                    required: {
                      value: true,
                      message: 'You must enter a password',
                    },
                    minLength: {
                      value: 6,
                      message: 'Your password must be at least 6 characters',
                    },
                    maxLength: {
                      value: 20,
                      message:
                        'The password must be between 6 and 20 characters',
                    },
                  })}
                />
                <SuccessMessage
                  errors={errors}
                  name="password"
                  values={getValues()}
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
                    required: {
                      value: true,
                      message: 'Please confirm your password',
                    },
                    minLength: {
                      value: 6,
                      message:
                        'Your confirm password must be at least 6 characters',
                    },
                    maxLength: {
                      value: 20,
                      message:
                        'Your confirm password must be between 6 and 20 characters',
                    },
                  })}
                />
                <SuccessMessage
                  errors={errors}
                  name="confirmPassword"
                  values={getValues()}
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
                reset={reset}
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
