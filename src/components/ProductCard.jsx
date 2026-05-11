import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dress } from '../assets';

const ProductCard = ({ id, name, price, description, stock }) => {
  const isSoldOut = stock === 0;
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow duration-300">
      {/* Image section (unchanged) */}
      <div className="relative mb-4">
        <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center overflow-hidden">
          <img src={Dress} alt={name} className="w-full h-full object-contain" />
        </div>
        {isSoldOut && (
          <button className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center shadow-md">
            Sold
          </button>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
      <p className="text-xl font-bold text-red-600 mb-2">P{price.toLocaleString()}</p>
      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{description}</p>

      {/* View More Details button now navigates */}
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