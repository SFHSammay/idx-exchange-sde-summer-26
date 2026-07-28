import { useState } from "react";

const emptyFilters = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

function PropertyFilters({ onSearch, onClear }) {
  const [filters, setFilters] = useState(emptyFilters);

  function handleChange(event) {
    const { name, value } = event.target;

    setFilters({
      ...filters,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(filters);
  }

  function handleClear() {
    setFilters(emptyFilters);
    onClear();
  }

  return (
    <form className="property-filters" onSubmit={handleSubmit}>
      <label>
        City
        <input
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="Champaign"
        />
      </label>

      <label>
        ZIP Code
        <input
          name="zipcode"
          value={filters.zipcode}
          onChange={handleChange}
          placeholder="61820"
        />
      </label>

      <label>
        Min Price
        <input
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="200000"
        />
      </label>

      <label>
        Max Price
        <input
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="600000"
        />
      </label>

      <label>
        Beds
        <select name="beds" value={filters.beds} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </label>

      <label>
        Baths
        <select name="baths" value={filters.baths} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </label>

      <div className="filter-actions">
        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </form>
  );
}

export default PropertyFilters;
