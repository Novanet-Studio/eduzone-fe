import './Product.scss'

const Product = ({ product, currentProductSelected, handleClick }) => (
  <div className="product">
    <h4 className="product__name">{product.name}</h4>
    <p className="product__prices">{product.price}</p>
    <div className="product__interval">Per {product.interval}</div>
    <div className="product__billed">Billed {product.billed}</div>
    {product.key === currentProductSelected?.key ? (
      <>
        <input type="radio" id="producto" name="gender" defaultChecked />
        <label htmlFor="male">{currentProductSelected.name}</label>
      </>
    ) : (
      <>
        <input
          type="radio"
          id="producto"
          onChange={() => handleClick(product.key)}
          name="gender"
          value={product.key}
        />
        <label htmlFor="male">{product.name}</label>
      </>
    )}
  </div>
)

export default Product
