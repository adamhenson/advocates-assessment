"use client";

import React from "react";

/**
 * Sorting controls for the advocates table
 */
const SortControls = ({
  onChangeDirection,
  onChangeField,
  sortDirection,
  sortField,
}: {
  /** Handler to change sort direction */
  onChangeDirection: (direction: "asc" | "desc") => void;

  /** Handler to change sort field */
  onChangeField: (
    field: "firstName" | "lastName" | "city" | "degree" | "yearsOfExperience"
  ) => void;

  /** Current sort direction */
  sortDirection: "asc" | "desc";

  /** Current sort field */
  sortField: "firstName" | "lastName" | "city" | "degree" | "yearsOfExperience";
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="text-sm text-gray-700">Sort by</label>
      <select
        className="border rounded px-2 py-1"
        value={sortField}
        onChange={(e) =>
          onChangeField(
            e.target.value as
              | "firstName"
              | "lastName"
              | "city"
              | "degree"
              | "yearsOfExperience"
          )
        }
      >
        <option value="firstName">First Name</option>
        <option value="lastName">Last Name</option>
        <option value="city">City</option>
        <option value="degree">Degree</option>
        <option value="yearsOfExperience">Years of Experience</option>
      </select>

      <select
        className="border rounded px-2 py-1"
        value={sortDirection}
        onChange={(e) =>
          onChangeDirection(e.target.value as "asc" | "desc")
        }
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortControls;


