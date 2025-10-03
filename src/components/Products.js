import React, { useState } from 'react';
import { useGetProductsQuery } from '../store/api/productApi';
import ProductCard from './ProductCard';

const Products = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(products?.flatMap(product => product.categories) || [])];

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">All Products</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">
          Failed to load products. Please try again later.
        </div>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-12">
              <p className="text-muted">
                Showing {filteredProducts?.length || 0} of {products?.length} products
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
            </div>
          </div>

          <div className="row">
            {filteredProducts?.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {filteredProducts?.length === 0 && (
            <div className="text-center py-5">
              <h5>No products found</h5>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;