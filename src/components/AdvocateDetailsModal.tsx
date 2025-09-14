"use client";

import React from "react";
import type { Advocate } from "@/types/advocate";

const backdrop =
  "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50";

/**
 * Basic accessible modal for showing advocate details
 */
const AdvocateDetailsModal = ({
  advocate,
  onClose,
}: {
  /** Advocate to show */
  advocate: Advocate | null;
  /** Close handler */
  onClose: () => void;
}) => {
  if (!advocate) return null;

  return (
    <div className={backdrop} role="dialog" aria-modal="true">
      <div className="bg-white rounded shadow-md max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {advocate.firstName} {advocate.lastName}
          </h2>
          <button
            type="button"
            className="px-2 py-1 border rounded"
            onClick={onClose}
            aria-label="Close details"
          >
            Close
          </button>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div>
            <span className="font-medium">City:</span> {advocate.city}
          </div>
          <div>
            <span className="font-medium">Degree:</span> {advocate.degree}
          </div>
          <div>
            <span className="font-medium">Years of Experience:</span> {advocate.yearsOfExperience}
          </div>
          <div>
            <span className="font-medium">Phone:</span>
            <button
              type="button"
              className="ml-2 underline"
              onClick={() => navigator.clipboard.writeText(String(advocate.phoneNumber))}
            >
              {advocate.phoneNumber} (copy)
            </button>
          </div>
          <div>
            <span className="font-medium">Specialties:</span>
            <ul className="list-disc ml-6">
              {advocate.specialties.map((s, i) => (
                <li key={`${advocate.id ?? "x"}-spec-${i}`}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvocateDetailsModal;
