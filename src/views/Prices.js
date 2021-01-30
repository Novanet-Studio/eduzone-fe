import { useState } from 'react'
import { withRouter } from 'react-router-dom'

import Product from '../components/Product'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PaymentForm from '../components/PaymentForm'

import Modal from '../components/Modal'
// import useModal from '../hooks/useModal'

import { products } from '../constants'
import './Prices.scss'

function Prices({ location }) {
  const [productSelected, setProduct] = useState(null)
  // const [isOpen, openModal, closeModal] = useModal(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loadAccount, setLoadAccount] = useState(false)
  const [customer] = useState(location.state.customer)

  const handleClick = (key) => setProduct(products[key])

  const closeModal = (e) => {
    setIsOpen(false)
    setLoadAccount(true)
  }

  const setSent = () => {
    setIsOpen(true)
  }

  return (
    <>
      <Header />
      <Modal isOpen={isOpen} closeModal={closeModal} />
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
                setSent={setSent}
                load={loadAccount}
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
