import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessModal = ({ isOpen, onClose, orderDetails }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
        <p className="text-gray-600 mb-2">Thank you for your order.</p>
        {orderDetails?.orderCode && (
          <p className="text-sm text-gray-500 mb-2">Order Code: {orderDetails.orderCode}</p>
        )}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Shipping fee not yet included.</strong> We will calculate the shipping cost based on your location and order weight, then email you the final amount with payment instructions within 24 hours.
          </p>
        </div>
        <button onClick={handleContinue} className="w-full bg-lime-600 hover:bg-lime-700 text-white font-medium py-2 rounded-lg transition">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;