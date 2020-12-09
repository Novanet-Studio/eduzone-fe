import React from 'react'

const Product = ({ product, currentProductSelected, handleClick }) => (
  <div className="product">
    <h3 className="product__name">{product.name}</h3>
    <p>{product.price}</p>
    <div className="product__info">
      <div className="product__interval">Per {product.interval}</div>
      <div className="product__billed">Billed {product.billed}</div>
    </div>
    <div className="product__btn-wrapper">
      {currentProductSelected ? (
        <button type="submit">Selected</button>
      ) : (
        <button onClick={() => handleClick(product.key)} type="submit">
          Selected
        </button>
      )}
    </div>
  </div>
)

export default Product