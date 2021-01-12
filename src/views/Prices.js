import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'

import Product from '../components/Product'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PaymentForm from '../components/PaymentForm'
import './Prices.scss'

import { products } from '../utils'

function Prices({ location }) {
  const [productSelected, setProduct] = useState(null)
  const [customer] = useState(location.state.customer)
  // const [formData] = useState(location.state.formData)

  const handleClick = (key) => setProduct(products[key])

  return (
    <>
      <Header />
      <section className="prices">
        <div className="container">
          <div className="prices__info">
            <h2 className="prices__title">Subscribe to plan</h2>
            <div className="prices__products">
              {products.map((product, index) => (
                <Product
                  key={index}
                  product={product}
                  handleClick={handleClick}
                />
              ))}
            </div>
            {productSelected && (
              <PaymentForm
                productSelected={productSelected}
                customer={customer}
                // formData={formData}
              />
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default withRouter(Prices)
