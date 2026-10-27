import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Component Phân trang dùng chung (Pagination.jsx)
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  itemLabel = 'mục',
}) {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  // Tạo danh sách các số trang cần hiển thị thông minh
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="speakai-pagination-wrap animate-card-up" style={{ marginTop: '1.25rem' }}>
      {totalItems > 0 && (
        <div className="pagination-info">
          Hiển thị <b>{startIdx}</b> – <b>{endIdx}</b> trên tổng số <b>{totalItems}</b> {itemLabel}
        </div>
      )}

      <div className="speakai-pagination">
        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <FiChevronLeft className="react-icon" /> Trang trước
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span key={`dots-${idx}`} style={{ padding: '0 0.35rem', color: '#94a3b8' }}>
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className="pagination-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Trang sau <FiChevronRight className="react-icon" />
        </button>
      </div>
    </div>
  );
}

