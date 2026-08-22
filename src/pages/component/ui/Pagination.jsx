import React from 'react';

export const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className="flex justify-center space-x-2 mt-4">
      {[...Array(totalPages).keys()].map((page) => (
        <button
          key={page + 1}
          className={`px-4 py-2 rounded-md ${currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onPageChange(page + 1)}
        >
          {page + 1}
        </button>
      ))}
    </div>
  );
};
