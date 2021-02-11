import './Product.scss'

const Product = ({ product, currentProductSelected, handleClick }) => (
  <div className="product">
    <h4 className="product__name">{product.name}</h4>
    <p className="product__prices">{product.price}</p>
      <div className="product__interval">Per {product.interval}</div>
      <div className="product__billed">Billed {product.billed}</div>
      {product.key === currentProductSelected?.key ? (
        <button className="product__btn" style={{
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #579bd9'
        }} type="submit">Selected</button>
      ) : (
        <button className="product__btn" onClick={() => handleClick(product.key)} type="submit">
          Select
        </button>
      )}
  </div>
)

export default Product
