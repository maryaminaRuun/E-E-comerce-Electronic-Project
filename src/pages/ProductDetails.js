import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import CartContext from '../context/CartContext';
import ProductContext from '../context/ProductContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { products } = useContext(ProductContext);
  const product = products.find(item => String(item.id) === String(id));
  if (!product) return <div className="empty-state page-space"><h1>Product not found</h1><Link className="button primary" to="/products">Back to shop</Link></div>;
  return <div className="product-page container-wide">
    <div className="breadcrumbs"><Link to="/">Home</Link><i className="fa-solid fa-chevron-right"/><Link to="/products">Shop</Link><i className="fa-solid fa-chevron-right"/><span>{product.name}</span></div>
    <div className="detail-grid"><div className="detail-image">{product.badge&&<span className="product-badge">{product.badge}</span>}<img src={product.image} alt={product.name}/></div><div className="detail-copy"><p className="product-category">{product.category}</p><h1>{product.name}</h1><div className="rating"><span>★★★★★</span><small>{product.reviews} verified reviews</small></div><h2>${product.price.toFixed(2)}</h2><p>{product.description}</p><ul><li><i className="fa-solid fa-check"/>Premium quality and tested performance</li><li><i className="fa-solid fa-check"/>Official 2-year warranty included</li><li><i className="fa-solid fa-check"/>Fast, tracked delivery</li></ul><button className="button primary add-large" onClick={()=>addToCart(product)}><i className="fa-solid fa-bag-shopping"/> Add to cart</button><div className="detail-assurance"><span><i className="fa-solid fa-shield-halved"/>Secure payment</span><span><i className="fa-solid fa-rotate-left"/>30-day returns</span></div></div></div>
  </div>;
};
export default ProductDetails;
