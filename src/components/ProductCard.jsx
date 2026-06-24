import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dress } from '../assets';
import { optimizeCloudinaryUrl } from '../utils/imageOptimizer';

const ProductCard = ({ id, name, price, description, stock, imageUrls }) => {
  const isSoldOut = stock === 0;
  const navigate = useNavigate();
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : [Dress];

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  // Product grids should load one optimized thumbnail instead of every gallery image.
  const primaryImage = optimizeCloudinaryUrl(images[0], 400);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow duration-300">
      <div className="relative mb-4">
        <div className="bg-gray-100 rounded-md overflow-hidden aspect-[4/5]">
          <img
            src={primaryImage}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        {isSoldOut && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center shadow-md z-10 pointer-events-none">
            Sold
          </div>
        )}
      </div>

      <p className="text-xl font-bold text-red-600 mb-2">P{price.toLocaleString()}</p>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

      <button
        onClick={handleViewDetails}
        className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${
          isSoldOut ? 'bg-red-600 hover:bg-red-700' : 'bg-lime-600 hover:bg-lime-700'
        }`}
      >
        View More Details
      </button>
    </div>
  );
};

export default ProductCard;
