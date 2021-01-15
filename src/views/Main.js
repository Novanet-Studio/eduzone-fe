import { useState } from 'react'
import { Redirect } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Subscribe from '../components/Subscribe'
import MainDropdown from '../components/MainDropdown'

import Ipad from '../assets/images/ipad-libros.png'
import './Main.scss'

function Main() {
  const [isSuscribed, setIsSubscribed] = useState(false)
  const [redirectLogin, setRedirectLogin] = useState(false)

  const subscribe = (value) => setIsSubscribed(value)

  console.log('Is subscribe from main? ', isSuscribed);

  if (isSuscribed) {
    return <Redirect to="/register" />
  }

  if (redirectLogin) {
    return <Redirect to='/login' />
  }

  return (
    <>
      <Header loggedIn={false} handleClick={() => setRedirectLogin(true)} />
      <div>
        <section className="hero">
          <div className="container">
            <div className="hero__info">
              <h2 className="hero__title">Discover our interactive eBooks</h2>
              <p className="hero__text">
                Subscribe and gain access to our content
              </p>
              <Subscribe subscribe={subscribe} />
            </div>
          </div>
        </section>

        <section className="enjoy">
          <div className="container">
            <div className="enjoy__col-left">
              <h2 className="enjoy__title">Enjoy on your device</h2>
              <p className="enjoy_text">
                Access our Ebooks from your favorite web browsers (Chrome,
                Safari, Edge, Firefox)
              </p>
              <p className="enjoy_text">
                Our books are interactive and you can enjoy games, videos, and
                images while your learn
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
            <MainDropdown />
            <div className="faq__info">
              <h3 className="faq__info-title">
                Discover our interactive eBooks
              </h3>
              <p className="faq__info-text">
                Subscribe and gain access to our content
              </p>
              <Subscribe parentClass="faq" subscribe={subscribe} />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Main
