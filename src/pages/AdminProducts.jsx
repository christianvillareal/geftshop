import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { fetchProducts, deleteProduct } from '../services/api';
import { Dress } from '../assets';
import AlertModal from '../components/AlertModal';
import { optimizeCloudinaryUrl } from '../utils/imageOptimizer';

import 'swiper/css';
import 'swiper/css/pagination';

const AdminProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sizeFilter, setSizeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState({ open: false, title: '', message: '', type: 'info' });
  const [refreshKey, setRefreshKey] = useState(0);
  const itemsPerPage = 4;

  const showAlert = (title, message, type = 'info') => {
    setAlert({ open: true, title, message, type });
  };
  const closeAlert = () => setAlert({ open: false, title: '', message: '', type: 'info' });

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts();
      const sorted = [...data].sort((a, b) => {
        if (a.stock > 0 && b.stock === 0) return -1;
        if (a.stock === 0 && b.stock > 0) return 1;
        return b.id - a.id;
      });
      setProducts(sorted);
    } catch (err) {
      console.error('Failed to load products:', err);
      showAlert('Error', 'Could not load products', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, location.key, refreshKey]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setRefreshKey(prev => prev + 1);
        showAlert('Success', 'Product deleted', 'success');
      } catch (err) {
        console.error(err);
        showAlert('Error', 'Delete failed', 'error');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
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
  const handlePageChange = (page) => setCurrentPage(page);

  const handleEdit = (id) => {
    navigate(`/admin/manage-products?id=${id}`);
  };

  if (loading) return <div className="text-center py-10">Loading products...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-2 gap-3 md:flex md:justify-between md:items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Sizes</option>
              <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option>
              <option>2XL</option><option>3XL</option><option>4XL</option>
            </select>
          </div>
          <div className="md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search Dress"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-500 text-lg mb-2">No results found</div>
          <p className="text-gray-400">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => {
              const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [Dress];
              const hasMultiple = images.length > 1;
              const isSoldOut = Number(product.stock) === 0;
              // Optimize thumbnails for product list (150px width)
              const optimizedImages = images.map(img => optimizeCloudinaryUrl(img, 300));
              
              return (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="relative mb-4">
                    <div className="bg-gray-100 rounded-md overflow-hidden aspect-[4/5]">
                      {hasMultiple ? (
                        <Swiper
                          modules={[Pagination]}
                          spaceBetween={0}
                          slidesPerView={1}
                          pagination={{ clickable: true }}
                          loop
                          className="product-card-swiper w-full h-full"
                        >
                          {optimizedImages.map((img, idx) => (
                            <SwiperSlide key={idx}>
                              <img
                                src={img}
                                alt={`${product.name} - ${idx + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <img
                          src={optimizedImages[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    {isSoldOut && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center shadow-md z-10">
                        Sold
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xl font-bold text-red-600 mb-2">P{product.price.toLocaleString()}</p>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <div className="text-sm text-gray-500 mb-3">
                    Stock: {product.stock} | Size: {product.size}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => handleEdit(product.id)} className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-8 gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-lime-600 text-white' : ''}`}>{i + 1}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </>
      )}

      <AlertModal isOpen={alert.open} onClose={closeAlert} title={alert.title} message={alert.message} type={alert.type} />
    </div>
  );
};

export default AdminProducts;
