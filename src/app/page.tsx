"use client";

import { useEffect, useMemo, useState } from "react";
import type { Advocate } from "../types/advocate";
import SearchBar from "@/components/SearchBar";
import AdvocatesTable from "@/components/AdvocatesTable";
import SortControls from "@/components/SortControls";
import Pagination from "@/components/Pagination";
import AdvocateDetailsModal from "@/components/AdvocateDetailsModal";
import Spinner from "@/components/Spinner";

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
  const [selected, setSelected] = useState<Advocate | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
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
    const controller = new AbortController();
    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.set("q", searchTerm);
        if (sortField) params.set("sort", sortField);
        if (sortDirection) params.set("dir", sortDirection);
        params.set("page", String(page));
        params.set("size", String(pageSize));
        const res = await fetch(`/api/advocates?${params.toString()}`, {
          signal: controller.signal,
        });
        const json: { data: Advocate[]; total: number; page: number; size: number } = await res.json();
        setAdvocates(json.data);
        setFilteredAdvocates(json.data);
        setHasFetched(true);
      } catch (e) {
        // ignore aborts
      } finally {
        setIsLoading(false);
      }
    }, 200);
    return () => {
      controller.abort();
      clearTimeout(handler);
    };
  }, [searchTerm, sortField, sortDirection, page, pageSize]);

  // initial fetch handled by the effect above

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
      {isLoading && (
        <div className="text-gray-600 flex items-center gap-2">
          <Spinner />
          <span>Loading advocates…</span>
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}
      {!isLoading && !error && hasFetched && filteredAdvocates.length === 0 && (
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
            onSelect={setSelected}
            query={searchTerm}
          />
          <AdvocateDetailsModal advocate={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </main>
  );
}
