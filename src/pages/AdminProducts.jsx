import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dress } from '../assets';
import { products as allProducts } from '../data/products';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products] = useState(allProducts);
  const [sizeFilter, setSizeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSize = sizeFilter ? product.size === sizeFilter : true;
    const matchesColor = colorFilter ? product.color.toLowerCase().includes(colorFilter.toLowerCase()) : true;
    const matchesSearch = searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesSize && matchesColor && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [sizeFilter, colorFilter, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  const handleEdit = (id) => {
    navigate(`/admin/manage-products?id=${id}`);
  };

  const handleDelete = (id) => {
    console.log('Delete product', id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>

      {/* Filter + Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
            <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
              <option value="">All Sizes</option>
              <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
            <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
              <option value="">All Colors</option>
              <option>Pink</option><option>Blue</option><option>Beige</option><option>Black</option><option>Multicolor</option>
            </select>
          </div>
          <div className="ml-auto w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
            <input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
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
            {paginatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="relative mb-4">
                  <div className="bg-gray-100 h-64 rounded-md overflow-hidden">
                    <img src={Dress} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center shadow-md">
                      Sold
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-xl font-bold text-red-600 mb-2">P{product.price.toLocaleString()}</p>
                <div className="text-sm text-gray-500 mb-3">
                  Stock: {product.stock} | Size: {product.size}<br />
                  Color: {product.color}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(product.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition">Delete</button>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default AdminProducts;