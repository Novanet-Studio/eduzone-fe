import React, { useState } from 'react'
import Ipad from '../assets/images/ipad-libros.png'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Subscribe from '../components/Subscribe'
import './Main.scss'


function Main() {

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
              <Subscribe />
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
              <Subscribe parentClass="faq" />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Main
