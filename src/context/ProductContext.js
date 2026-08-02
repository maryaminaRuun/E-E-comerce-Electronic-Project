import { createContext, useCallback, useEffect, useState } from 'react';
import mockProducts from '../pages/mockProducts';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const ProductContext=createContext();
export const ProductProvider=({children})=>{
 const [products,setProducts]=useState(mockProducts); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
 const refresh=useCallback(async()=>{if(!isSupabaseConfigured){setLoading(false);return} const {data,error:e}=await supabase.from('products').select('*').eq('active',true).order('created_at',{ascending:false});if(e)setError(e.message);else setProducts(data);setLoading(false)},[]);
 useEffect(()=>{refresh()},[refresh]);
 const addProduct=async product=>{const {error:e}=await supabase.from('products').insert({...product,image_url:product.image,image:undefined});if(e)throw e;await refresh()};
 const updateProduct=async product=>{const {id,created_at,...changes}=product;changes.image_url=changes.image;delete changes.image;const {error:e}=await supabase.from('products').update(changes).eq('id',id);if(e)throw e;await refresh()};
 const deleteProduct=async id=>{const {error:e}=await supabase.from('products').update({active:false}).eq('id',id);if(e)throw e;await refresh()};
 const displayProducts=products.map(p=>({...p,image:p.image||p.image_url}));
 return <ProductContext.Provider value={{products:displayProducts,loading,error,refresh,addProduct,updateProduct,deleteProduct,isSupabaseConfigured}}>{children}</ProductContext.Provider>
};
export default ProductContext;
