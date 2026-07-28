import { useEffect, useRef, useState } from "react";
import { fetchProperties } from "../api/client";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestRequestId = useRef(0);

  async function loadProperties(filters = {}) {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;

    try {
      setLoading(true);
      setError("");

      const data = await fetchProperties(removeEmptyFilters(filters));

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

  useEffect(() => {
    loadProperties();
  }, []);

  function handleSearch(filters) {
    loadProperties(filters);
  }

  function handleClear() {
    loadProperties();
  }

  if (loading) {
    return <main className="page-shell">Loading properties...</main>;
  }

  if (error) {
    return (
        <main className="page-shell">
        <div className="error-panel">
            <h1>Unable to load properties</h1>
            <p>{error}</p>
        </div>
        </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>PROPERTY LISTINGS</h1>
        <p>
          Showing {properties.length} of {total} properties
        </p>
      </header>

      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

      {properties.length === 0 ? (
        <section className="empty-state">
          <h2>No properties found</h2>
          <p>Try changing or clearing your filters.</p>
        </section>
      ) : (
        <section className="property-grid">
          {properties.map((property) => (
            <PropertyCard key={property.L_ListingID} property={property} />
          ))}
        </section>
      )}
    </main>
  );
}

export default ListingsPage;
