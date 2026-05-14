import React from 'react';
import { Link } from 'react-router-dom';
import { logo } from '../assets'; // adjust import path as needed

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Bottom Bar – three columns: logo left, links center, copyright right */}
        <div className="pt-2 mt-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            {/* Left: Logo */}
            <div className="flex items-center">
              <img src={logo} alt="Geft Shop" className="h-8 w-auto" />
            </div>

            {/* Center: Links */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/terms" className="text-gray-500 hover:text-lime-600 transition">Terms and Conditions</Link>
<Link to="/privacy" className="text-gray-500 hover:text-lime-600 transition">Privacy Policy</Link>
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