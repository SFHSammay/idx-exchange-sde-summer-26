import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchProperties();

        setProperties(data.results);
        setTotal(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

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

      <section className="property-grid">
        {properties.map((property) => (
          <PropertyCard key={property.L_ListingID} property={property} />
        ))}
      </section>
    </main>
  );
}

export default ListingsPage;