"use client";

import React from "react";

/**
 * Search input with reset button and accessible labeling
 */
const SearchBar = ({
  onChange,
  onReset,
  value,
}: {
  /** Change handler for the search input */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** Click handler to clear the current search */
  onReset: () => void;

  /** Current search term */
  value: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
        placeholder="Search by name, city, degree, specialty, years…"
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
      <button
        type="button"
        className="px-3 py-2 border rounded bg-white hover:bg-gray-50"
        onClick={onReset}
        aria-label="Clear search"
      >
        Clear
      </button>
    </div>
  );
};

export default SearchBar;


