import { useContext, useMemo, useState } from 'react';
import CartContext from '../context/CartContext';
import ProductContext from '../context/ProductContext';
import ProductCard from './ProductCard';

const ProductList = () => {
  const { addToCart } = useContext(CartContext);
  const { products: allProducts } = useContext(ProductContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const categories = ['All', ...new Set(allProducts.map(item => item.category))];
  const products = useMemo(() => {
    const result = allProducts.filter(p => (category === 'All' || p.category === category) && `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'low') return [...result].sort((a,b)=>a.price-b.price);
    if (sort === 'high') return [...result].sort((a,b)=>b.price-a.price);
    if (sort === 'rating') return [...result].sort((a,b)=>b.reviews-a.reviews);
    return result;
  }, [search, category, sort, allProducts]);

  return <div className="catalog container-wide">
    <div className="catalog-heading"><span className="eyebrow">THE COLLECTION</span><h1>Shop electronics</h1><p>Carefully selected technology for work, play and everything in between.</p></div>
    <div className="shop-toolbar"><label className="search-box"><i className="fa-solid fa-magnifying-glass"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."/></label><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Most reviewed</option></select></div>
    <div className="category-pills">{categories.map(item=><button className={category===item?'active':''} onClick={()=>setCategory(item)} key={item}>{item}</button>)}</div>
    <div className="results-line"><span>{products.length} products</span></div>
    {products.length ? <div className="products-grid">{products.map(product=><ProductCard key={product.id} product={product} addToCart={addToCart}/>)}</div> : <div className="empty-state"><i className="fa-solid fa-magnifying-glass"/><h2>No products found</h2><p>Try another search or category.</p></div>}
  </div>;
};
export default ProductList;
