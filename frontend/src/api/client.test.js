import { fetchProperties, fetchPropertyDetail } from "./client";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("fetchProperties loads properties", async () => {
  const mockData = {
    total: 1,
    results: [{ L_ListingID: "123" }],
  };

  global.fetch.mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(mockData),
  });

  const data = await fetchProperties();

  expect(global.fetch).toHaveBeenCalledWith("/api/properties");
  expect(data).toEqual(mockData);
});

test("fetchProperties sends query parameters", async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ total: 0, results: [] }),
  });

  await fetchProperties({ city: "Champaign", beds: "2" });

  expect(global.fetch).toHaveBeenCalledWith(
    "/api/properties?city=Champaign&beds=2"
  );
});

test("fetchPropertyDetail throws a backend error message", async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 404,
    headers: {
      get: jest.fn().mockReturnValue("application/json"),
    },
    json: jest.fn().mockResolvedValue({ error: "Property not found" }),
  });

  await expect(fetchPropertyDetail("bad-id")).rejects.toThrow(
    "Property not found"
  );
});
