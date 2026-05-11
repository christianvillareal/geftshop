import React from 'react';
import ProductCard from '../components/ProductCard';
import FilterSection from '../components/FilterSection';
import Pagination from '../components/Pagination';
import About from '../components/About';
import Testimonials from '../components/Testimonial';

import { products } from '../data/products';

const Home = () => {
  return (
    <>
    <div className="bg-gray-50 min-h-screen">

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filter + Search Section */}
        <FilterSection />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <Pagination />


      </div>
    </div>

  <About />
  <Testimonials />
  </>
  );
};

export default Home;