import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'

import Product from '../components/Product'
import Footer from '../components/Footer'
import PaymentForm from '../components/PaymentForm'
import TopNavigationBar from '../components/TopNavigationBar'

import { products } from '../utils'

function Prices({ location }) {
  const [productSelected, setProduct] = useState(null)
  const [customer] = useState(location.state.customer)
  const [formData] = useState(location.state.formData)

  const handleClick = (key) => setProduct(products[key])

  return (
    <>
      <TopNavigationBar />
      <div>
        <div className="message">Subscribe to plan</div>
        <div className="products">
          {products.map((product, index) => (
            <Product key={index} product={product} handleClick={handleClick} />
          ))}
        </div>
        {productSelected && (
          <PaymentForm productSelected={productSelected} customer={customer} formData={formData} />
        )}
      </div>
      <Footer />
    </>
  )
}

export default withRouter(Prices)
