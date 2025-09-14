"use client";

import React from "react";

/**
 * Pagination controls with page size selector
 */
const Pagination = ({
  page,
  pageSize,
  total,
  onChangePage,
  onChangePageSize,
}: {
  /** Current page (1-based) */
  page: number;
  /** Current page size */
  pageSize: number;
  /** Total item count */
  total: number;
  /** Page change handler */
  onChangePage: (page: number) => void;
  /** Page size change handler */
  onChangePageSize: (size: number) => void;
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={!canPrev}
          onClick={() => onChangePage(page - 1)}
        >
          Prev
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={!canNext}
          onClick={() => onChangePage(page + 1)}
        >
          Next
        </button>
      </div>

      <label className="text-sm text-gray-700">
        Show
        <select
          className="ml-2 border rounded px-2 py-1"
          value={pageSize}
          onChange={(e) => onChangePageSize(parseInt(e.target.value, 10))}
        >
          {[10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <span className="text-sm text-gray-500">{total} results</span>
    </div>
  );
};

export default Pagination;
