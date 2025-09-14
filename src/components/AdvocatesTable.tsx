"use client";

import React from "react";
import type { Advocate } from "@/types/advocate";

/**
 * Accessible advocates table
 */
const AdvocatesTable = ({
  advocates,
}: {
  /** Rows to display */
  advocates: Advocate[];
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
              <tr key={rowKey} className="hover:bg-gray-50">
                <td className="p-2">{advocate.firstName}</td>
                <td className="p-2">{advocate.lastName}</td>
                <td className="p-2">{advocate.city}</td>
                <td className="p-2">{advocate.degree}</td>
                <td className="p-2">
                  {advocate.specialties.map((s, idx) => (
                    <div key={`${rowKey}-spec-${idx}`}>{s}</div>
                  ))}
                </td>
                <td className="p-2">{advocate.yearsOfExperience}</td>
                <td className="p-2">{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdvocatesTable;


