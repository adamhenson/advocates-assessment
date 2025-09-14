"use client";

import React from "react";
import type { Advocate } from "@/types/advocate";
import Highlight from "@/components/Highlight";

/**
 * Accessible advocates table
 */
const AdvocatesTable = ({
  advocates,
  onSelect,
  query,
}: {
  /** Rows to display */
  advocates: Advocate[];
  /** Row select handler */
  onSelect?: (a: Advocate) => void;
  /** Active search term for highlighting */
  query?: string;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th scope="col" className="text-left border-b p-2">First Name</th>
            <th scope="col" className="text-left border-b p-2">Last Name</th>
            <th scope="col" className="text-left border-b p-2">City</th>
            <th scope="col" className="text-left border-b p-2">Degree</th>
            <th scope="col" className="text-left border-b p-2">Specialties</th>
            <th scope="col" className="text-left border-b p-2">Years of Experience</th>
            <th scope="col" className="text-left border-b p-2">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate) => {
            const rowKey = advocate.id ?? `${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`;
            return (
              <tr
                key={rowKey}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect?.(advocate)}
              >
                <td className="p-2"><Highlight text={advocate.firstName} query={query || ""} /></td>
                <td className="p-2"><Highlight text={advocate.lastName} query={query || ""} /></td>
                <td className="p-2"><Highlight text={advocate.city} query={query || ""} /></td>
                <td className="p-2"><Highlight text={advocate.degree} query={query || ""} /></td>
                <td className="p-2">
                  {advocate.specialties.map((s, idx) => (
                    <div key={`${rowKey}-spec-${idx}`}>
                      <Highlight text={s} query={query || ""} />
                    </div>
                  ))}
                </td>
                <td className="p-2"><Highlight text={advocate.yearsOfExperience} query={query || ""} /></td>
                <td className="p-2"><Highlight text={advocate.phoneNumber} query={query || ""} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdvocatesTable;


