import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import Ipad from '../assets/images/ipad-libros.png'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { fetchData, URL } from '../utils'
import "./Main.scss"

const initialState = {
  email: '',
  password: '',
}

function Main() {
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
    <>
      <Header loggedIn={false} />
      <div>
          <section className="hero">
            <div className="container">
              <div className="hero__info">
                <h2 className="hero__title">Discover our interactive eBooks</h2>
                <p className="hero__text">
                  Subscribe and gain access to our content
                </p>
                <form className="hero__subs" onSubmit={handleSubmit}>
                  <input
                    className="hero__input"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email address"
                    value={state.email}
                    onChange={handleChange}
                  />
                  <button className="hero__button" type="submit">
                    {loading ? 'Loading...' : 'Subscribe'}
                  </button>
                </form>
              </div>
            </div>
          </section>

          <section className="enjoy">
            <div className="container">
              <div className="enjoy__col-left">
                <h2 className="enjoy__title">Enjoy on your device</h2>
                <p className="enjoy_text">
                  Access our Ebooks from your favorite web browsers (Chrome,
                  Safari, Edge, Firefox). Our books are interactive and you can
                  enjoy games, videos, and images while your learn
                </p>
              </div>
              <div className="enjoy__col-right">
                <img className="enjoy__img" src={Ipad} alt="Enjoy ipad" />
              </div>
            </div>
          </section>

          <section className="faq">
            <div className="container">
              <h2 className="faq__title">Frequently Asked Questions</h2>
              <div className="faq__drop">
                <h4 className="faq__question">What is Edu-zone?</h4>
                <p className="faq__answer">
                  Lorem ipsum dolor sit amet, consectetur adi
                </p>
              </div>
              <div className="faq__drop">
                <h4 className="faq__question">
                  What content will i find in the subscription?
                </h4>
                <p className="faq__answer">
                  Lorem ipsum dolor sit amet, consectetur adi
                </p>
              </div>
              <div className="faq__drop">
                <h4 className="faq__question">How much does it cost?</h4>
                <p className="faq__answer">
                  Lorem ipsum dolor sit amet, consectetur adi
                </p>
              </div>
              <div className="faq__drop">
                <h4 className="faq__question">Where can i access Edu-zone?</h4>
                <p className="faq__answer">
                  Lorem ipsum dolor sit amet, consectetur adi
                </p>
              </div>
              <div className="faq__drop">
                <h4 className="faq__question">How do i cancel?</h4>
                <p className="faq__answer">
                  Lorem ipsum dolor sit amet, consectetur adi
                </p>
              </div>

              <div className="faq__info">
                <h3 className="faq__info-title">
                  Discover our interactive eBooks
                </h3>
                <p className="faq__info-text">
                  Subscribe and gain access to our content
                </p>

                <form className="faq__info-subs" onSubmit={handleSubmit}>
                  <input
                    className="faq__info-input"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email address"
                    value={state.email}
                    onChange={handleChange}
                  />
                  <button className="faq__info-button" type="submit">
                    {loading ? 'Loading...' : 'Subscribe'}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      <Footer />
    </>
  )
}

export default Main
