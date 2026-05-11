import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const [selectedUnit, setSelectedUnit] = useState('inch');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link to="/" className="text-lime-600 hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  const isSoldOut = product.stock === 0;

  // Conversion functions
  const convertSize = (valueInInches, unit) => {
    if (unit === 'inch') return valueInInches;
    if (unit === 'cm') return (valueInInches * 2.54).toFixed(1);
    if (unit === 'mm') return (valueInInches * 25.4).toFixed(0);
    return valueInInches;
  };

  const bust = convertSize(product.sizes.bust, selectedUnit);
  const length = convertSize(product.sizes.length, selectedUnit);
  const waist = convertSize(product.sizes.waist, selectedUnit);

  // Unit label
  const unitLabel = selectedUnit === 'inch' ? 'in' : selectedUnit === 'cm' ? 'cm' : 'mm';

  // Images array (use product.images or fallback to single image)
  const images = Array.isArray(product.image) ? product.image : [product.image];

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
            {/* Image Section – vertical slider on desktop, horizontal on mobile */}
            <div className="lg:w-1/2">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Thumbnails – vertical on lg, horizontal on smaller */}
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
                {/* Main image */}
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
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-400">
                  {'★'.repeat(product.rating)}
                  {'☆'.repeat(5 - product.rating)}
                </div>
                <span className="text-gray-500 text-sm">({product.reviewCount} Reviews)</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>

              <p className="text-sm text-gray-500 mb-2">DRESS CODE: {product.dressCode}</p>

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

              {/* Size section with unit converter */}
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800">Sizes</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedUnit('inch')}
                      className={`px-2 py-1 text-xs rounded ${
                        selectedUnit === 'inch' ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Inch
                    </button>
                    <button
                      onClick={() => setSelectedUnit('cm')}
                      className={`px-2 py-1 text-xs rounded ${
                        selectedUnit === 'cm' ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      CM
                    </button>
                    <button
                      onClick={() => setSelectedUnit('mm')}
                      className={`px-2 py-1 text-xs rounded ${
                        selectedUnit === 'mm' ? 'bg-lime-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
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

              <p className="text-gray-700 mb-4"><span className="font-medium">Color:</span> {product.color}</p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  disabled={isSoldOut}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${
                    isSoldOut ? 'bg-gray-300 cursor-not-allowed' : 'bg-lime-600 hover:bg-lime-700 text-white'
                  }`}
                >
                  {isSoldOut ? 'Sold Out' : 'Add To Cart'}
                </button>
                <button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition">
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;