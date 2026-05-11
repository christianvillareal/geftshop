import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSection from '../components/FilterSection';
import Pagination from '../components/Pagination';
import { products } from '../data/products';

const Products = () => {
  // Filter states
  const [sizeFilter, setSizeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // adjust as needed

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSize = sizeFilter ? product.size === sizeFilter : true;
    const matchesColor = colorFilter ? product.color.toLowerCase().includes(colorFilter.toLowerCase()) : true;
    const matchesSearch = searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesSize && matchesColor && matchesSearch;
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sizeFilter, colorFilter, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <FilterSection
          sizeFilter={sizeFilter}
          setSizeFilter={setSizeFilter}
          colorFilter={colorFilter}
          setColorFilter={setColorFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-500 text-lg mb-2">No products found</div>
            <p className="text-gray-400">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Products;