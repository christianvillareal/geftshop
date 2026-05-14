import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { createProduct, updateProduct, fetchProduct } from '../services/api';
import AlertModal from '../components/AlertModal';

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

const AdminManageProduct = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('id');
  const isEditMode = !!productId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: 1,
    dressCode: '',
    bust: '',
    length: '',
    waist: '',
    asianSize: '',
    imageUrls: [],
    newImages: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ open: false, title: '', message: '', type: 'info' });

  // Cropping states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentCroppingFile, setCurrentCroppingFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);

  const showAlert = (title, message, type = 'info') => {
    setAlert({ open: true, title, message, type });
  };

  const closeAlert = () => setAlert({ open: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    if (isEditMode && productId) {
      fetchProduct(productId)
        .then(product => {
          if (product) {
            setFormData({
              name: product.name || '',
              description: product.description || '',
              price: product.price || '',
              stock: product.stock > 0 ? 1 : 0,
              dressCode: product.dressCode || '',
              bust: product.bust !== undefined ? product.bust : '',
              length: product.length !== undefined ? product.length : '',
              waist: product.waist !== undefined ? product.waist : '',
              asianSize: product.asianSize || '',
              imageUrls: product.imageUrls || [],
              newImages: [],
            });
          }
        })
        .catch(err => console.error('Failed to load product:', err));
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
    setFormData(prev => ({ ...prev, stock: e.target.value === 'On Hand' ? 1 : 0 }));
  };

  // Cropping helpers
  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => { image.onload = resolve; });
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg');
    });
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    if (!currentCroppingFile || !croppedAreaPixels) return;
    const objectUrl = URL.createObjectURL(currentCroppingFile);
    const croppedBlob = await getCroppedImg(objectUrl, croppedAreaPixels);
    URL.revokeObjectURL(objectUrl);
    setFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, croppedBlob]
    }));
    const remaining = pendingFiles.slice(1);
    setPendingFiles(remaining);
    setCropModalOpen(false);
    setCurrentCroppingFile(null);
    if (remaining.length > 0) {
      setCurrentCroppingFile(remaining[0]);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setCropModalOpen(true);
    }
  };

  const handleCancelCrop = () => {
    setCropModalOpen(false);
    setCurrentCroppingFile(null);
    setPendingFiles([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalAfterAdd = formData.imageUrls.length + formData.newImages.length + files.length;
    if (totalAfterAdd > 8) {
      showAlert('Image Limit', 'You can only add up to 8 images total.', 'warning');
      return;
    }
    setPendingFiles(prev => [...prev, ...files]);
    if (!cropModalOpen && pendingFiles.length === 0) {
      setCurrentCroppingFile(files[0]);
      setCropModalOpen(true);
    }
  };

  const removeExistingImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const removeNewImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalImages = formData.imageUrls.length + formData.newImages.length;
    if (totalImages > 8) {
      showAlert('Image Limit', `Maximum 8 images allowed. You have ${totalImages} images.`, 'warning');
      return;
    }
    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('size', formData.asianSize);
    data.append('stock', parseInt(formData.stock));
    data.append('dressCode', formData.dressCode);
    data.append('bust', formData.bust);
    data.append('length', formData.length);
    data.append('waist', formData.waist);
    data.append('asianSize', formData.asianSize);

    if (formData.imageUrls.length > 0) {
      data.append('existingImages', JSON.stringify(formData.imageUrls));
    }
    formData.newImages.forEach(file => {
      data.append('images', file);
    });

    try {
      if (isEditMode) {
        await updateProduct(productId, data);
        showAlert('Success', 'Product updated successfully', 'success');
      } else {
        await createProduct(data);
        showAlert('Success', 'Product added successfully', 'success');
      }
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      console.error(err);
      showAlert('Error', err.message || 'Error saving product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalImages = formData.imageUrls.length + formData.newImages.length;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">General Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea rows="4" name="description" value={formData.description} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                <select value={formData.stock === 1 ? 'On Hand' : 'Sold Out'} onChange={handleStockChange} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="On Hand">On Hand</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dress Code</label>
              <input
                type="text"
                name="dressCode"
                value={isEditMode ? (formData.dressCode || '') : 'Auto‑generated on save'}
                disabled
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
              {!isEditMode && <p className="text-xs text-gray-400 mt-1">Will be created automatically</p>}
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Sizes (inches)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Bust</label>
                  <input type="number" step="0.1" name="bust" value={formData.bust} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Waist</label>
                  <input type="number" step="0.1" name="waist" value={formData.waist} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Length</label>
                  <input type="number" step="0.1" name="length" value={formData.length} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Asian Size (auto)</label>
                <input type="text" name="asianSize" value={formData.asianSize} disabled className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100" />
                <p className="text-xs text-gray-400 mt-1">Automatically calculated based on Bust, Waist, Length.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditMode ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </div>

        {/* Image upload area (unchanged) */}
        <div className="lg:w-96 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Product Images</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100"
          />
          <p className="text-xs text-gray-400 mt-2">Max 8 images total. Each image will be cropped to 4:5 after selection.</p>
          <p className="text-xs text-lime-600 mt-1">Current: {totalImages} / 8</p>

          {formData.imageUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Current images:</p>
              <div className="grid grid-cols-4 gap-2">
                {formData.imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt={`existing ${idx}`} className="w-full aspect-[4/5] object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.newImages.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">New images (already cropped):</p>
              <div className="grid grid-cols-4 gap-2">
                {formData.newImages.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img src={URL.createObjectURL(file)} alt={`preview ${idx}`} className="w-full aspect-[4/5] object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.imageUrls.length === 0 && formData.newImages.length === 0 && (
            <div className="mt-4 text-center text-gray-400 text-sm py-4 border-2 border-dashed rounded-md">No images yet</div>
          )}
        </div>
      </form>

      {/* Cropping Modal */}
      {cropModalOpen && currentCroppingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Crop Image to 4:5 Portrait</h3>
            <div className="relative h-64 w-full bg-gray-100 rounded overflow-hidden">
              <Cropper
                image={URL.createObjectURL(currentCroppingFile)}
                crop={crop}
                zoom={zoom}
                aspect={4 / 5}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={handleCancelCrop} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleCropConfirm} className="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-md">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal isOpen={alert.open} onClose={closeAlert} title={alert.title} message={alert.message} type={alert.type} />
    </div>
  );
};

export default AdminManageProduct;