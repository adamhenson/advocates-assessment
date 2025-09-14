"use client";

import React from "react";

/**
 * Inline highlighter that wraps case-insensitive matches in a mark element
 */
const Highlight = ({
  query,
  text,
}: {
  /** The search term to highlight (case-insensitive) */
  query: string;
  /** The source text to render with highlights */
  text: string | number;
}) => {
  const value = String(text);
  const q = query?.trim();
  if (!q) return <>{value}</>;

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "ig");
  const parts = value.split(regex);

  return (
    <>
      {parts.map((part, idx) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={idx} className="bg-yellow-200">
            {part}
          </mark>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
};

export default Highlight;


