import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ErrorMessage as ErrorFormMessage } from '@hookform/error-message'

import Layout from '../../layout/Layout'

import ErrorMessage, {
  ErrorMessageContainer,
  SuccessMessage,
} from '@components/ErrorMessage'
import ScrollToTop from '@/components/ScrollToTop'
import { useError, useModal } from '@hooks'
import { products } from '@constants'
import Product from '@components/Product'
import PaymentForm from './components/PaymentForm'
import './Register.scss'
import Modal from '@/components/Modal'

function Register() {
  const sessionEmail = sessionStorage.getItem('email') || null
  const sessionProduct = JSON.parse(sessionStorage.getItem('eduzone::product'))
  const {
    register,
    errors,
    getValues,
    setError,
    clearErrors,
    reset: resetForm,
  } = useForm({ mode: 'onChange' })
  const [productSelected, setProductSelected] = useState(sessionProduct || null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [input, setInput] = useState(null)
  const [error, showError] = useState(null)
  const [isOpenModal, openModal, closeModal] = useModal(false)

  useEffect(() => {
    const emailInput = document.getElementById('emailInput')
    emailInput.onpaste = (e) => e.preventDefault()

    if (error) {
      openModal()
    }

  }, [error])

  const handleClick = (key) => {
    sessionStorage.setItem('eduzone::product', JSON.stringify(products[key]))
    setProductSelected(products[key])
  }

  const reset = () => {
    resetForm()
    sessionStorage.removeItem('email')
  }

  const handleChange = () => {
    const values = getValues()

    const areFieldsFull = !!values.email && !!values.confirmEmail && !!values.password && !!values.confirmPassword

    const emails = [
      {
        type: 'manual',
        name: 'email',
        message: 'Emails do not match',
      },
      {
        type: 'manual',
        name: 'confirmEmail',
        message: 'Emails do not match',
      },
    ]

    const passwords = [
      {
        type: 'manual',
        name: 'password',
        message: 'Passwords do not match',
      },
      {
        type: 'manual',
        name: 'confirmPassword',
        message: 'Passwords do not match',
      },
    ]

    if (values.email === values.confirmEmail) {
      clearErrors(['email', 'confirmEmail'])
    }

    if (values.password === values.confirmPassword) {
      clearErrors(['password', 'confirmPassword'])
    }

    if (values.confirmEmail) {
      if (values.email !== values.confirmEmail) {
        emails.forEach(({ name, ...config }) => setError(name, config))
      }
    }

    if (values.confirmPassword) {
      if (values.password !== values.confirmPassword) {
        passwords.forEach(({ name, ...config }) => setError(name, config))
      }
    }

    if (areFieldsFull) {
      setIsButtonDisabled(false)
      setInput(values)
    }
  }

  return (
    <Layout>
      <ScrollToTop />
      <Modal isOpen={isOpenModal} closeModal={closeModal}>
        <h2 className="modal__title">There was an error while register</h2>
        <p className="modal__text">{error}</p>
      </Modal>
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
            <form
              className="register__form"
              onChange={handleChange}
            >
              <div className="register__form-control">
                <input
                  className="input register__input"
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
                  register__input
                  name="email"
                  as={<ErrorMessageContainer />}
                />
              </div>
              <div className="register__form-control">
                <input
                  id="emailInput"
                  className="input register__input"
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
                  className="input register__input"
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
                  className="input register__input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Password confirmation"
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
                disabled={isButtonDisabled}
              />
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Register
