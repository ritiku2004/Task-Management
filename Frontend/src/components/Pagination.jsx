import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center items-center mt-6">
      <ul className="flex items-center space-x-2">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition backdrop-blur-md
              ${
                currentPage === 1
                  ? "bg-blue-200/20 text-blue-300 cursor-not-allowed"
                  : "bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 shadow-lg shadow-blue-500/30"
              }`}
          >
            Prev
          </button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition backdrop-blur-md
                ${
                  currentPage === number
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/40"
                    : "bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 shadow-md shadow-blue-500/20"
                }`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition backdrop-blur-md
              ${
                currentPage === totalPages
                  ? "bg-blue-200/20 text-blue-300 cursor-not-allowed"
                  : "bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 shadow-lg shadow-blue-500/30"
              }`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
