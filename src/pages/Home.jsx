import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterSection from '../components/FilterSection';
import Pagination from '../components/Pagination';
import About from '../components/About';
import Testimonials from '../components/Testimonial';
import { fetchProducts } from '../services/api';

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sizeFilter, setSizeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        // Sort: in-stock first, sold-out last
        const sorted = [...data].sort((a, b) => {
          if (a.stock > 0 && b.stock === 0) return -1;
          if (a.stock === 0 && b.stock > 0) return 1;
          return b.id - a.id;
        });
        setAllProducts(sorted);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Could not load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = allProducts.filter(product => {
    const matchesSize = sizeFilter ? product.size === sizeFilter : true;
    const matchesSearch = searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesSize && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [sizeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="bg-gray-50 min-h-screen flex items-center justify-center">Loading products...</div>;
  if (error) return <div className="bg-gray-50 min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <FilterSection
            sizeFilter={sizeFilter}
            setSizeFilter={setSizeFilter}
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
      <About />
      <Testimonials />
    </>
  );
};

export default Home;