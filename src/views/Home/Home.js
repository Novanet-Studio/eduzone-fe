import { useState } from 'react'
import { Redirect } from 'react-router-dom'

import Accordion from '@components/Accordion'
import Product from '@components/Product'
import Carousel from '@components/Carousel'
import { Header, Footer } from '@layout'
import { CarouselItems, Subscribe } from './components'
import { faq, products } from '@constants'
import LogoEnjoy from '@images/edu-zone-enjoy.png'
import './Home.scss'

function Home() {
  const [login, setLogin] = useState(false)
  const [productSelected, setProductSelected] = useState(null)

  const changeLocation = () => setLogin(true)

  if (login) {
    return <Redirect to="/login" />
  }

  const handleClick = (key) => {
    sessionStorage.setItem('eduzone::product', JSON.stringify(products[key]))
    setProductSelected(products[key])
  }

  // react-slick props
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <>
      <Header loggedIn={false} onClick={changeLocation} />
      <div>
        <section className="hero">
          <div className="container">
            <Carousel items={CarouselItems} settings={settings} />
          </div>
        </section>

        <section className="enjoy">
          <div className="container">
            <div className="enjoy__col-left">
              <h2 className="enjoy__title">Enjoy on your device</h2>
              <p className="enjoy__text">
                Edu-zone’s digital subscription provides access to more than
                3,000 pages of digital content, English Language & Arts and Math
                for K1-6: this content is organized by grades, in the form of
                ebooks enriched with illustrations, photos, videos, games, and
                practice questions, ideal for students, parents, teachers, and
                educational institutions. All our contents are aligned with the
                common core standards. Our platform is an essential tool for the
                development of literacy and numeracy skills and abilities in ELA
                and MATH at levels 1 to 6.
              </p>
            </div>
            <div className="enjoy__col-right">
              <img
                className="enjoy__img"
                src={LogoEnjoy}
                alt="Logo Eduzone Enjoy"
              />
            </div>
          </div>
        </section>

        <section className="plan">
          <div className="container">
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
            <p className="plan__text">
              All our subscriptions include a 30-day free trial, we will not
              charge anything until 30 days after the subscription date you can
              cancel your subscription at any time.
            </p>
            <Subscribe />
          </div>
        </section>

        <section className="faq">
          <div className="container">
            <h2 className="faq__title">Frequently Asked Questions</h2>
            <Accordion data={faq} />
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Home
