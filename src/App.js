import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home'; import Products from './pages/Products'; import ProductDetails from './pages/ProductDetails'; import Cart from './pages/Cart'; import Checkout from './pages/Checkout'; import SignUp from './pages/SignUp'; import SignIn from './pages/SignIn';
import Header from './components/Header'; import Footer from './components/Footer';
import { CartProvider } from './context/CartContext'; import { ProductProvider } from './context/ProductContext';
import AdminLogin from './pages/admin/AdminLogin'; import AdminDashboard from './pages/admin/AdminDashboard';
import './styles/main.css';
function AppContent(){const isAdmin=useLocation().pathname.startsWith('/admin');return <>{!isAdmin&&<Header/>}<main><Routes><Route path="/" element={<Home/>}/><Route path="/products" element={<Products/>}/><Route path="/products/:id" element={<ProductDetails/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/signup" element={<SignUp/>}/><Route path="/signin" element={<SignIn/>}/><Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin" element={<AdminDashboard/>}/><Route path="*" element={<Home/>}/></Routes></main>{!isAdmin&&<Footer/>}</>}
function App(){return <BrowserRouter><CartProvider><ProductProvider><AppContent/></ProductProvider></CartProvider></BrowserRouter>}
export default App;
