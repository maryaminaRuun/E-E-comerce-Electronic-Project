import { Link } from 'react-router-dom';

const ProductCard = ({ product, addToCart }) => (
  <article className="product-card">
    <Link className="product-image" to={`/products/${product.id}`}>
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <img src={product.image} alt={product.name} loading="lazy" />
    </Link>
    <div className="product-info">
      <p className="product-category">{product.category}</p>
      <Link to={`/products/${product.id}`}><h3>{product.name}</h3></Link>
      <div className="rating"><span>★★★★★</span><small>({product.reviews || 48})</small></div>
      <div className="product-bottom"><strong>${product.price.toFixed(2)}</strong><button onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}><i className="fa-solid fa-plus" /> Add</button></div>
    </div>
  </article>
);
export default ProductCard;
