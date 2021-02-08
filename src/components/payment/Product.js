import './Product.scss'

const Product = ({ product, currentProductSelected, handleClick }) => (
  <div className="product">
    <h4 className="product__name">{product.name}</h4>
    <p className="product__prices">{product.price}</p>
      <div className="product__interval">Per {product.interval}</div>
      <div className="product__billed">Billed {product.billed}</div>
      {currentProductSelected ? (
        <button className="product__btn" type="submit">Selected</button>
      ) : (
        <button className="product__btn" onClick={() => handleClick(product.key)} type="submit">
          Selected
        </button>
      )}
  </div>
)

export default Product
