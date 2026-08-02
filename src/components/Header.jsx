import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import CartContext from '../context/CartContext';

const Header = () => {
  const { cartCount } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <div className="announcement"><span>Free delivery on orders over $100</span><span>30-day easy returns</span><span>Secure checkout</span></div>
      <header className="site-header">
        <nav className="nav-shell container-wide">
          <Link className="brand" to="/" onClick={close}><span className="brand-mark"><i className="fa-solid fa-bolt" /></span><span>Volt<span>X</span></span></Link>
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation"><i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} /></button>
          <div className={`nav-content ${open ? 'open' : ''}`}>
            <div className="nav-links">
              <NavLink to="/" onClick={close}>Home</NavLink>
              <NavLink to="/products" onClick={close}>Shop</NavLink>
            </div>
            <div className="nav-actions">
              <NavLink to="/signin" onClick={close} aria-label="Account"><i className="fa-regular fa-user" /><span>Account</span></NavLink>
              <NavLink className="cart-link" to="/cart" onClick={close} aria-label={`Cart with ${cartCount} items`}><i className="fa-solid fa-bag-shopping" /><span>Cart</span>{cartCount > 0 && <b>{cartCount}</b>}</NavLink>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};
export default Header;
