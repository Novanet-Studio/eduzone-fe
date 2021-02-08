import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Header, Footer } from '../layout'
import { PaymentForm, Product } from '../components/payment'
import { products } from '../constants'
import './Prices.scss'

function Prices() {
  const location = useLocation()
  const [productSelected, setProductSelected] = useState(null)

  const handleClick = (key) => setProductSelected(products[key])


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
                customer={location.state.customer}
              />
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Prices
