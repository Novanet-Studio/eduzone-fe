import './Product.scss'

const Product = ({ product, currentProductSelected, handleClick }) => (
  <div className="products__card">
    <div className="products__head">
      <h4 className="products__title">{product.name}</h4>
    </div>
    <div className="products__data">
      <p className="products__data-name">{product.name}</p>
      <p className="products__data-description">
        {product.content.map((line) => (
          <div>{line}</div>
        ))}
      </p>
      <p className="products__data-description">Access up to 5 users</p>
      <img
        className="products__data-img"
        src={product.image}
        alt="ProductImg"
      />
      <p className="products__data-price">
        {product.price} / {product.billed}
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
