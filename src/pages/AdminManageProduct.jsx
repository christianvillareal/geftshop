import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { products as allProducts } from '../data/products';

const getAsianSize = (bust, length, waist) => {
  const b = parseFloat(bust) || 0;
  const l = parseFloat(length) || 0;
  const w = parseFloat(waist) || 0;
  if (b === 0 && l === 0 && w === 0) return '';
  const avg = (b + l + w) / 3;
  if (avg <= 28) return 'XS';
  if (avg <= 32) return 'S';
  if (avg <= 36) return 'M';
  if (avg <= 40) return 'L';
  if (avg <= 44) return 'XL';
  if (avg <= 48) return '2XL';
  if (avg <= 52) return '3XL';
  return '4XL';
};

const colorOptions = [
  'Red', 'Blue', 'Black', 'White', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Gray', 'Brown', 'Beige', 'Multicolor'
];

const AdminManageProduct = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('id');
  const isEditMode = !!productId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    color: '',
    stock: 1,          // 1 = On Hand, 0 = Sold Out (derived from product.stock > 0 ? 1 : 0)
    productWeight: '',
    shippingFee: '',
    dressCode: '',
    weightKg: '',
    bust: '',
    length: '',
    waist: '',
    asianSize: '',
    images: [],
  });

  // Load product data from shared products array
  useEffect(() => {
    if (isEditMode && productId) {
      const product = allProducts.find(p => p.id === parseInt(productId));
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          color: product.color || '',
          stock: product.stock > 0 ? 1 : 0,   // stock > 0 → On Hand, stock === 0 → Sold Out
          productWeight: product.productWeight || '',
          shippingFee: product.shippingFee || '',
          dressCode: product.dressCode || '',
          weightKg: product.weightKg || '',
          bust: product.sizes?.bust !== undefined ? product.sizes.bust : '',
          length: product.sizes?.length !== undefined ? product.sizes.length : '',
          waist: product.sizes?.waist !== undefined ? product.sizes.waist : '',
          asianSize: product.asianSize || '',
          images: [],
        });
      }
    }
  }, [isEditMode, productId]);

  // Auto‑calculate Asian Size
  useEffect(() => {
    const newSize = getAsianSize(formData.bust, formData.length, formData.waist);
    setFormData(prev => ({ ...prev, asianSize: newSize }));
  }, [formData.bust, formData.length, formData.waist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, stock: value === 'On Hand' ? 1 : 0 }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isEditMode ? 'Updating product:' : 'Adding new product:', formData);
    alert(isEditMode ? 'Product updated (mock)' : 'Product added (mock)');
    navigate('/admin/products');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">General Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea rows="4" name="description" value={formData.description} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select name="color" value={formData.color} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Select Color</option>
                  {colorOptions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                <select value={formData.stock === 1 ? 'On Hand' : 'Sold Out'} onChange={handleStockChange} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="On Hand">On Hand</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Weight (kg)</label>
                <input type="number" step="0.01" name="productWeight" value={formData.productWeight} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Fee (₱)</label>
                <input type="number" name="shippingFee" value={formData.shippingFee} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dress Code</label>
                <input type="text" name="dressCode" value={formData.dressCode} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight in kg (min 50)</label>
              <input type="number" name="weightKg" value={formData.weightKg} onChange={handleChange} min="50" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Sizes (inches)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Bust</label>
                  <input type="number" step="0.1" name="bust" value={formData.bust} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Length</label>
                  <input type="number" step="0.1" name="length" value={formData.length} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Waist</label>
                  <input type="number" step="0.1" name="waist" value={formData.waist} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Asian Size (auto)</label>
                <input type="text" name="asianSize" value={formData.asianSize} disabled className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100" />
                <p className="text-xs text-gray-400 mt-1">Automatically calculated based on Bust, Length, Waist.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-md font-medium">{isEditMode ? 'Update Product' : 'Add Product'}</button>
          </div>
        </div>

        {/* RIGHT COLUMN – Image Upload */}
        <div className="lg:w-96 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Upload Images</h2>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={URL.createObjectURL(img)} alt={`preview ${idx}`} className="w-full h-24 object-cover rounded-md border" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">×</button>
              </div>
            ))}
            {formData.images.length === 0 && (
              <div className="col-span-2 text-center text-gray-400 text-sm py-8 border-2 border-dashed rounded-md">No images uploaded yet</div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-3">You can upload multiple images. Click the × to remove.</p>
        </div>
      </form>
    </div>
  );
};

export default AdminManageProduct;