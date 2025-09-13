"use client";

import { useEffect, useState } from "react";
import type { Advocate } from "../types/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const handler = setTimeout(() => {
      const q = searchTerm.toLowerCase();
      const filtered = advocates.filter((advocate) => {
        const first = advocate.firstName?.toLowerCase?.() || "";
        const last = advocate.lastName?.toLowerCase?.() || "";
        const city = advocate.city?.toLowerCase?.() || "";
        const degree = advocate.degree?.toLowerCase?.() || "";
        const specs = Array.isArray(advocate.specialties) ? advocate.specialties : [];
        const years = advocate.yearsOfExperience?.toString?.() || "";

        return (
          first.includes(q) ||
          last.includes(q) ||
          city.includes(q) ||
          degree.includes(q) ||
          specs.some((s) => s.toLowerCase().includes(q)) ||
          years.includes(q)
        );
      });
      setFilteredAdvocates(filtered);
    }, 200);

    return () => clearTimeout(handler);
  }, [searchTerm, advocates]);

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/advocates");
        const json: { data: Advocate[] } = await response.json();
        setAdvocates(json.data);
        setFilteredAdvocates(json.data);
      } catch (e: any) {
        setError("Failed to load advocates");
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTerm = e.target.value;
    setSearchTerm(nextTerm);
  };

  const onClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="m-6">
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>Searching for: {searchTerm}</p>
        <input className="border border-black rounded px-2 py-1" value={searchTerm} onChange={onChange} />
        <button className="ml-2 px-3 py-1 border rounded" onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      {isLoading && <div>Loading advocates…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!isLoading && !error && (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left border-b p-2">First Name</th>
              <th className="text-left border-b p-2">Last Name</th>
              <th className="text-left border-b p-2">City</th>
              <th className="text-left border-b p-2">Degree</th>
              <th className="text-left border-b p-2">Specialties</th>
              <th className="text-left border-b p-2">Years of Experience</th>
              <th className="text-left border-b p-2">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => {
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
      )}
    </main>
  );
}
