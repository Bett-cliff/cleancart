'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';

export default function TestApi() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error('API Connection failed:', error);
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) return <div>Loading products from backend...</div>;

  return (
    <div>
      <h1>API Test Page</h1>
      <p>Products from backend: {products.length}</p>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}