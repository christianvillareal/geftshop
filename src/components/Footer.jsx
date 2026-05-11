import React from 'react';
import { logo } from '../assets'; // adjust import path as needed

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Newsletter Section – two columns */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 max-w-4xl mx-auto mb-12">
          {/* Left: Text content */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Subscribe to our newsletter
            </h3>
            <p className="text-gray-500">
              Stay up to date with our latest updates
            </p>
          </div>
          {/* Right: Form */}
          <div className="flex flex-col sm:flex-row gap-3 min-w-[300px]">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
            <button className="bg-lime-600 hover:bg-lime-700 text-white font-medium px-6 py-2 rounded-lg transition duration-200">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar – three columns: logo left, links center, copyright right */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            {/* Left: Logo */}
            <div className="flex items-center">
              <img src={logo} alt="Geft Shop" className="h-8 w-auto" />
            </div>

            {/* Center: Links */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="text-gray-500 hover:text-lime-600 transition">Terms and Conditions</a>
              <a href="#" className="text-gray-500 hover:text-lime-600 transition">Privacy Policy</a>
            </div>

            {/* Right: Copyright */}
            <div className="text-gray-400 text-center">
              © Geft Shop Clothing {new Date().getFullYear()} All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;