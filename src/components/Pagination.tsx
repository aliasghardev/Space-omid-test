'use client';

import React from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Pagination component with "Previous", numbered pages, and "Next" buttons
export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 space-x-4 text-black">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        ◀
      </button>

      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded ${
            currentPage === p ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-400 disabled:opacity-50"
      >
        ▶
      </button>
    </div>
  );
};
