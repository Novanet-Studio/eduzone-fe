import './Product.scss'
import ProductImg from '../assets/images/math-books-eduzone.png'

const Product = ({ product, currentProductSelected, handleClick }) => (
  <div className="products__card">
    <div className="products__head">
      <h4 className="products__title">{product.name}</h4>
    </div>
    <div className="products__data">
      <p className="products__data-name">{product.name}</p>
      <p className="products__data-description">Grades 1 to 5</p>
      <p className="products__data-description">Access up to 5 users</p>
      <img
        className="products__data-img"
        src={ProductImg}
        alt="ProductImg"
      />
      <p className="products__data-price">
        {product.price} / {product.interval} / {product.billed}
      </p>
    </div>
    {product.key === currentProductSelected?.key ? (
      <>
        <input
          type="radio"
          id="producto"
          name="gender"
          defaultChecked
          className="products__check"
        />
      </>
    ) : (
      <>
        <input
          type="radio"
          id="producto"
          className="products__check"
          onChange={() => handleClick(product.key)}
          name="gender"
          value={product.key}
        />
      </>
    )}
  </div>
)

export default Product
