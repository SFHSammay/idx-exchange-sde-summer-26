async function requestJson(url, fallbackMessage) {
  const response = await fetch(url);

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || `${fallbackMessage} (${response.status})`);
    }

    throw new Error("Backend server is not running.");
  }

  return response.json();
}

export function fetchProperties(params = {}) {
  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();
  const url = queryString ? `/api/properties?${queryString}` : "/api/properties";

  return requestJson(url, "Unable to load properties");
}

export function fetchPropertyDetail(id) {
  return requestJson(`/api/properties/${id}`, "Unable to load property details");
}