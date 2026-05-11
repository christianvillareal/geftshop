import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center gap-2 flex-wrap">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md border transition duration-200 ${
            currentPage === 1
              ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-lime-600 hover:text-white hover:border-lime-600'
          }`}
        >
          Previous
        </button>

        {/* Page numbers */}
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-md border transition duration-200 ${
              page === currentPage
                ? 'bg-lime-600 text-white border-lime-600'
                : 'border-gray-300 text-gray-700 hover:bg-lime-600 hover:text-white hover:border-lime-600'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-md border transition duration-200 ${
            currentPage === totalPages
              ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-lime-600 hover:text-white hover:border-lime-600'
          }`}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;