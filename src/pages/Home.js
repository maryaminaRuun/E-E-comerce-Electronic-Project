import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ProductContext from '../context/ProductContext';

const categories = [
  ['fa-mobile-screen-button', 'Phones'], ['fa-laptop', 'Computers'], ['fa-headphones', 'Audio'],
  ['fa-gamepad', 'Gaming'], ['fa-camera', 'Cameras'], ['fa-tv', 'TV & Home']
];

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const { products } = useContext(ProductContext);
  return <>
    <section className="hero">
      <div className="container-wide hero-grid">
        <div className="hero-copy"><span className="eyebrow">NEXT-GEN TECHNOLOGY</span><h1>Upgrade your world.<br/><em>Power your future.</em></h1><p>Discover premium electronics selected for performance, design, and everyday life.</p><div className="hero-actions"><Link className="button primary" to="/products">Shop collection <i className="fa-solid fa-arrow-right" /></Link><a className="button ghost" href="#featured">Explore deals</a></div><div className="hero-proof"><b>4.9/5</b><span>★★★★★<small>Trusted by 12,000+ customers</small></span></div></div>
        <div className="hero-visual"><div className="hero-orb"/><img src={products[1]?.image || products[0]?.image} alt="Premium laptop"/><div className="floating-card"><span>Top rated</span><b>Laptop Pro</b><small>Power meets portability</small></div></div>
      </div>
    </section>
    <section className="benefits container-wide"><div><i className="fa-solid fa-truck-fast"/><span><b>Fast delivery</b><small>Reliable nationwide shipping</small></span></div><div><i className="fa-solid fa-shield-halved"/><span><b>2-year warranty</b><small>Shop with confidence</small></span></div><div><i className="fa-solid fa-headset"/><span><b>Expert support</b><small>Here when you need us</small></span></div><div><i className="fa-solid fa-lock"/><span><b>Secure payment</b><small>Your data stays protected</small></span></div></section>
    <section className="section container-wide"><div className="section-heading"><div><span className="eyebrow">SHOP BY CATEGORY</span><h2>Find your next upgrade</h2></div><Link to="/products">View all products <i className="fa-solid fa-arrow-right"/></Link></div><div className="category-grid">{categories.map(([icon, label]) => <Link key={label} to={`/products?category=${encodeURIComponent(label)}`}><i className={`fa-solid ${icon}`}/><span>{label}</span><small>Explore collection</small></Link>)}</div></section>
    <section className="section soft-section" id="featured"><div className="container-wide"><div className="section-heading"><div><span className="eyebrow">CUSTOMER FAVORITES</span><h2>Featured technology</h2></div><Link to="/products">Shop all <i className="fa-solid fa-arrow-right"/></Link></div><div className="products-grid">{products.slice(0,8).map(product => <ProductCard key={product.id} product={product} addToCart={addToCart}/>)}</div></div></section>
    <section className="newsletter"><div><span className="eyebrow">STAY AHEAD</span><h2>Tech news, offers and launches.</h2><p>Join our community and get 10% off your first order.</p></div><form onSubmit={e=>e.preventDefault()}><input type="email" required placeholder="Enter your email address"/><button>Get 10% off</button></form></section>
  </>;
};
export default Home;
