"use client";

import { useEffect, useState } from "react";
import type { Advocate } from "../types/advocate";
import SearchBar from "@/components/SearchBar";
import AdvocatesTable from "@/components/AdvocatesTable";
import SortControls from "@/components/SortControls";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<
    "firstName" | "lastName" | "city" | "degree" | "yearsOfExperience"
  >("lastName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
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
      const sorted = [...filtered].sort((a, b) => {
        const dir = sortDirection === "asc" ? 1 : -1;
        const getVal = (v: any) => (v ?? "").toString().toLowerCase();
        if (sortField === "yearsOfExperience") {
          return (a.yearsOfExperience - b.yearsOfExperience) * dir;
        }
        const av = getVal(a[sortField]);
        const bv = getVal(b[sortField]);
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
      setFilteredAdvocates(sorted);
    }, 200);

    return () => clearTimeout(handler);
  }, [searchTerm, advocates, sortField, sortDirection]);

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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SearchBar value={searchTerm} onChange={onChange} onReset={onClick} />
        <SortControls
          sortField={sortField}
          sortDirection={sortDirection}
          onChangeField={setSortField}
          onChangeDirection={setSortDirection}
        />
      </div>
      <br />
      <br />
      {isLoading && <div>Loading advocates…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!isLoading && !error && (
        <AdvocatesTable advocates={filteredAdvocates} />
      )}
    </main>
  );
}
