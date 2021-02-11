import { useState } from 'react'
import { Redirect } from 'react-router-dom'

import Accordion from '../../components/Accordion'
import { Header, Footer } from '../../layout'
import { Subscribe } from './components'
import { faq, products } from '../../constants'
import Ipad from '../../assets/images/ipad-libros.png'
import Product from '../../components/Product'
import './Home.scss'

const faqClasses = {
  parent: 'faq__drop',
  title: 'faq__question',
  body: 'faq__answer',
}

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

  return (
    <>
      <Header loggedIn={false} onClick={changeLocation} />
      <div>
        <section className="hero">
          <div className="container">
            {/* Carousel goes here */}
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

        <section style={{ backgroundColor: 'gray', padding: '1rem'}}>
          <h2>Choose a plan</h2>
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
          <Subscribe />
        </section>

        <section className="faq">
          <div className="container">
            <h2 className="faq__title">Frequently Asked Questions</h2>
            <Accordion data={faq} classes={faqClasses} />
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Home
