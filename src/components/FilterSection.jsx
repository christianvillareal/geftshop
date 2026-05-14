import React from 'react';

const FilterSection = ({ sizeFilter, setSizeFilter, searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-end justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          {/* Sizes dropdown only */}
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="w-full md:w-auto border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="">All Sizes</option>
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
          {/* Colors dropdown removed */}
        </div>

        {/* Search */}
        <div className="w-full lg:w-80">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Dress"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;