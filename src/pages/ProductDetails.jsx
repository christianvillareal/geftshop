import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../services/api';
import { Dress } from '../assets';
import ConfirmModal from '../components/ConfirmModal';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('inch');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart, cartItems } = useCart();

  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCartClick = () => {
    setPendingProduct(product);
    setShowConfirmModal(true);
  };

  const confirmAddToCart = () => {
    if (pendingProduct) {
      addToCart(pendingProduct, 1);
    }
    setPendingProduct(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link to="/" className="text-lime-600 hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  const isSoldOut = product.stock === 0;
  const isInCart = cartItems.some(item => item.id === product.id);

  // Conversion functions
  const convertSize = (valueInInches, unit) => {
    if (unit === 'inch') return valueInInches;
    if (unit === 'cm') return (valueInInches * 2.54).toFixed(1);
    if (unit === 'mm') return (valueInInches * 25.4).toFixed(0);
    return valueInInches;
  };

  // Use direct product fields (bust, length, waist) – not product.sizes
  const bust = convertSize(product.bust || 0, selectedUnit);
  const length = convertSize(product.length || 0, selectedUnit);
  const waist = convertSize(product.waist || 0, selectedUnit);
  const unitLabel = selectedUnit === 'inch' ? 'in' : selectedUnit === 'cm' ? 'cm' : 'mm';

  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [Dress];

  // Determine button state
  let buttonDisabled = false;
  let buttonText = 'Add To Cart';
  if (isSoldOut) {
    buttonDisabled = true;
    buttonText = 'Sold Out';
  } else if (isInCart) {
    buttonDisabled = true;
    buttonText = 'Already in Cart';
  }

  return (
    <div className="bg-gray-50 min-h-auto py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-lime-600">Home</Link> &gt;
          <Link to="/products" className="hover:text-lime-600 mx-1">Products</Link> &gt;
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-8">
            {/* Image Gallery */}
            <div className="lg:w-1/2">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-visible">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                        selectedImageIndex === idx ? 'border-lime-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex-1 order-1 md:order-2">
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {'★'.repeat(product.rating || 0)}
                  {'☆'.repeat(5 - (product.rating || 0))}
                </div>
                <span className="text-gray-500 text-sm">({product.reviewCount || 0} Reviews)</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
              <p className="text-sm text-gray-500 mb-2">DRESS CODE: {product.dressCode || 'N/A'}</p>

              <div className="mb-4">
                {product.originalPrice ? (
                  <>
                    <span className="text-2xl font-bold text-red-600">P{product.price.toLocaleString()}</span>
                    <span className="text-gray-400 line-through ml-3">P{product.originalPrice.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-red-600">P{product.price.toLocaleString()}</span>
                )}
              </div>

              {/* Size section – only show if any measurement exists */}
              {(product.bust || product.length || product.waist) && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">Sizes</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedUnit('inch')}
                        className={`px-2 py-1 text-xs rounded ${selectedUnit === 'inch' ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        Inch
                      </button>
                      <button
                        onClick={() => setSelectedUnit('cm')}
                        className={`px-2 py-1 text-xs rounded ${selectedUnit === 'cm' ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        CM
                      </button>
                      <button
                        onClick={() => setSelectedUnit('mm')}
                        className={`px-2 py-1 text-xs rounded ${selectedUnit === 'mm' ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        MM
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="font-medium">BUST:</span> {bust}{unitLabel}</div>
                    <div><span className="font-medium">LENGTH:</span> {length}{unitLabel}</div>
                    <div><span className="font-medium">WAIST:</span> {waist}{unitLabel}</div>
                  </div>
                </div>
              )}

              {product.color && (
                <p className="text-gray-700 mb-4"><span className="font-medium">Color:</span> {product.color}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleAddToCartClick}
                  disabled={buttonDisabled}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${
                    buttonDisabled
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-lime-600 hover:bg-lime-700 text-white'
                  }`}
                >
                  {buttonText}
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition"
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmAddToCart}
        title="Confirm Add to Cart"
        message={`Are you sure you want to add "${product.name}" to your cart?`}
      />
    </div>
  );
};

export default ProductDetails;