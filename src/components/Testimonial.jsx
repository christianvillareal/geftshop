import React, { useState } from 'react';

import { testimonialBG } from '../assets'; 

const testimonials = [
  {
    id: 1,
    name: 'Maria R.',
    review: 'Absolutely love my maxi dress! The quality is amazing and it fits perfectly. Will definitely order again.',
    rating: 5,
    location: 'Manila, PH',
  },
  {
    id: 2,
    name: 'Carla M.',
    review: 'Unique pieces that you won’t find anywhere else. The ukay curation is top‑notch. Highly recommend!',
    rating: 5,
    location: 'Cebu, PH',
  },
  {
    id: 3,
    name: 'Jessica L.',
    review: 'Fast shipping and the dress exceeded my expectations. Sustainable fashion at its best.',
    rating: 4,
    location: 'Davao, PH',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = testimonials[currentIndex];

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div id="reviews"
      className="relative bg-cover bg-center bg-no-repeat py-20 md:py-28"
      style={{ backgroundImage: `url(${testimonialBG})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 max-w-4xl mt-80">
        {/* Section title */}
        <h5 className='font-bold px-4 py-1 bg-lime-100 text-lime-800 w-32 text-center mb-5 mx-auto'>REVIEWS</h5>
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
            Real Customer Reviews

        </h2>

        {/* Testimonial card – gray background, relative for quote icon */}
        <div className="bg-gray-100 rounded-2xl shadow-xl relative p-6 md:py-20 md:mx-10">
          {/* Green circle with quote icon – overlapping top‑left */}
          <div className="absolute -top-4 -left--10 bg-lime-600 rounded-full w-12 h-12 flex items-center justify-center shadow-md z-20">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          

          {/* Review text – left aligned */}
          <p className="text-gray-800 text-lg md:text-xl leading-relaxed text-left mb-6">
            “{current.review}”
          </p>

          {/* Name & location – right aligned */}
          <div className="text-right">
            <p className="font-bold text-gray-900 text-lg">{current.name}</p>
            <p className="text-gray-600 text-sm">{current.location}</p>
          </div>
        </div>

        {/* Slider controls with functionality */}
        <div className="flex justify-center items-center gap-4 mt-8">
         

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                className={`h-2.5 rounded-full transition ${idx === currentIndex ? 'bg-lime-600 w-6' : 'bg-lime-600/50 w-2.5'}`}
              ></button>
            ))}
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Testimonials;