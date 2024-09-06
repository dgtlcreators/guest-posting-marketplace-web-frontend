import React from 'react';

const Pagination = ({ totalItems, currentPage, pageSize, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    onPageSizeChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Page size selection */}
      <div>
        <label htmlFor="pageSize" className="mr-2">Items per page:</label>
        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className="border rounded px-2 py-1">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={30}>30</option>
        </select>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          Previous
        </button>

        <span className="mx-4">Page {currentPage} of {totalPages}</span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
