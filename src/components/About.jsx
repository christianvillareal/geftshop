import React from 'react';
import { AboutImage } from '../assets'; 

const About = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Two column layout: image left, content right */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Left: Image */}
          <div className="md:w-1/2">
            <img 
              src={AboutImage} 
              alt="Geft Shop maxi dress" 
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="md:w-1/2">
            
            <h5 className='font-bold px-4 py-1 bg-lime-100 text-lime-800 w-32 text-center mb-5'>ABOUT US</h5>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-5">About Geft Shop Clothing</h2>
        
            
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Our story began on <span className="font-semibold">October 5, 2021</span>, 
                with a simple love for finding beautiful things. We started by offering 
                a wide variety of pieces, but as we grew, we fell in love with the 
                effortless grace of the maxi dress.
              </p>
              
              <p className="font-medium text-lime-700">
                Today, we have found our true calling: <span className="italic">Curated Ukay Maxi Dresses</span>.
              </p>
              
              <p>
                We believe that style shouldn’t come at the cost of the planet. 
                By shifting our focus to premium thrifted maxis, we give you the chance 
                to own a unique, floor‑length treasure that no one else has. From vintage 
                floral finds to modern silhouettes, we hand‑pick every piece to ensure 
                you get the best of “ukay” quality with a high‑end feel.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a 
                href="/geftshop#/contact/" 
                className="border-2 border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white font-medium py-2 px-6 rounded-full transition text-center"
              >
                CONTACT US
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;