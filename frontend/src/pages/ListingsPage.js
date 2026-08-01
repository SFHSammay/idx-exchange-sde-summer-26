import { useEffect, useRef, useState } from "react";
import { fetchProperties } from "../api/client";
import Pagination from "../components/Pagination";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";

function removeEmptyFilters(filters) {
  const activeFilters = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value.trim() !== "") {
      activeFilters[key] = value.trim();
    }
  }

  return activeFilters;
}

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestRequestId = useRef(0);
  const totalPages = Math.ceil(total / itemsPerPage);
  const firstResultNumber = (currentPage - 1) * itemsPerPage + 1;
  const lastResultNumber = firstResultNumber + properties.length - 1;
  const resultsSummary =
    total === 0
      ? "Showing 0 properties"
      : `Showing ${firstResultNumber}-${lastResultNumber} of ${total} properties`;

  useEffect(() => {
    async function loadProperties() {
      const requestId = latestRequestId.current + 1;
      latestRequestId.current = requestId;

      try {
        setLoading(true);
        setError("");

        const data = await fetchProperties({
          ...removeEmptyFilters(activeFilters),
          offset: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        });

        if (requestId !== latestRequestId.current) {
          return;
        }

        setProperties(data.results);
        setTotal(data.total);
      } catch (err) {
        if (requestId !== latestRequestId.current) {
          return;
        }

        setError(err.message);
      } finally {
        if (requestId === latestRequestId.current) {
          setLoading(false);
        }
      }
    }

    loadProperties();
  }, [activeFilters, currentPage, itemsPerPage]);

  function handleSearch(filters) {
    setCurrentPage(1);
    setActiveFilters(filters);
  }

  function handleClear() {
    setCurrentPage(1);
    setActiveFilters({});
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>PROPERTY LISTINGS</h1>
        <p>{loading ? "Loading properties..." : resultsSummary}</p>
      </header>

      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

      {loading ? (
        <section className="empty-state">
          <h2>Loading properties...</h2>
        </section>
      ) : error ? (
        <div className="error-panel">
          <h1>Unable to load properties</h1>
          <p>{error}</p>
        </div>
      ) : properties.length === 0 ? (
        <section className="empty-state">
          <h2>No properties found</h2>
          <p>Try changing or clearing your filters.</p>
        </section>
      ) : (
        <>
          <section className="property-grid">
            {properties.map((property) => (
              <PropertyCard key={property.L_ListingID} property={property} />
            ))}
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}

export default ListingsPage;
