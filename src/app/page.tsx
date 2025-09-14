"use client";

import { useEffect, useMemo, useState } from "react";
import type { Advocate } from "../types/advocate";
import SearchBar from "@/components/SearchBar";
import AdvocatesTable from "@/components/AdvocatesTable";
import SortControls from "@/components/SortControls";
import Pagination from "@/components/Pagination";

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Sync URL state
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (sortField !== "lastName") params.set("sort", sortField);
    if (sortDirection !== "asc") params.set("dir", sortDirection);
    if (page !== 1) params.set("page", String(page));
    if (pageSize !== 10) params.set("size", String(pageSize));
    const qs = params.toString();
    const url = qs ? `?${qs}` : "";
    window.history.replaceState(null, "", url);
  }, [searchTerm, sortField, sortDirection, page, pageSize]);

  // Initialize from URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const sort = params.get("sort") as any;
    const dir = params.get("dir") as any;
    const p = parseInt(params.get("page") || "1", 10);
    const size = parseInt(params.get("size") || "10", 10);
    if (q) setSearchTerm(q);
    if (sort && ["firstName", "lastName", "city", "degree", "yearsOfExperience"].includes(sort)) setSortField(sort);
    if (dir && ["asc", "desc"].includes(dir)) setSortDirection(dir);
    if (!Number.isNaN(p) && p > 0) setPage(p);
    if (!Number.isNaN(size) && [10, 25, 50].includes(size)) setPageSize(size);
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      setPage(1);
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
      {isLoading && <div className="text-gray-600">Loading advocates…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!isLoading && !error && filteredAdvocates.length === 0 && (
        <div className="text-gray-600">No results. Try adjusting your search.</div>
      )}
      {!isLoading && !error && filteredAdvocates.length > 0 && (
        <>
          <div className="flex items-center justify-between my-3">
            <div className="text-sm text-gray-600">
              {filteredAdvocates.length} results
            </div>
            <Pagination
              page={page}
              pageSize={pageSize}
              total={filteredAdvocates.length}
              onChangePage={setPage}
              onChangePageSize={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
          <AdvocatesTable
            advocates={filteredAdvocates.slice(
              (page - 1) * pageSize,
              page * pageSize
            )}
          />
        </>
      )}
    </main>
  );
}
