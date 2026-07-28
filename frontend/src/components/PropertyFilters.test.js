import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PropertyFilters from "./PropertyFilters";

test("renders all filter inputs", () => {
  render(<PropertyFilters onSearch={jest.fn()} onClear={jest.fn()} />);

  expect(screen.getByLabelText("City")).toBeInTheDocument();
  expect(screen.getByLabelText("ZIP Code")).toBeInTheDocument();
  expect(screen.getByLabelText("Min Price")).toBeInTheDocument();
  expect(screen.getByLabelText("Max Price")).toBeInTheDocument();
  expect(screen.getByLabelText("Beds")).toBeInTheDocument();
  expect(screen.getByLabelText("Baths")).toBeInTheDocument();
});

test("submits the selected filters", async () => {
  const onSearch = jest.fn();

  render(<PropertyFilters onSearch={onSearch} onClear={jest.fn()} />);

  userEvent.type(screen.getByLabelText("City"), "Champaign");
  userEvent.type(screen.getByLabelText("ZIP Code"), "61820");
  userEvent.type(screen.getByLabelText("Min Price"), "200000");
  userEvent.type(screen.getByLabelText("Max Price"), "600000");
  userEvent.selectOptions(screen.getByLabelText("Beds"), "2");
  userEvent.selectOptions(screen.getByLabelText("Baths"), "1");
  userEvent.click(screen.getByRole("button", { name: "Search" }));

  expect(onSearch).toHaveBeenCalledWith({
    city: "Champaign",
    zipcode: "61820",
    minPrice: "200000",
    maxPrice: "600000",
    beds: "2",
    baths: "1",
  });
});

test("clear button resets the form", async () => {
  const onClear = jest.fn();

  render(<PropertyFilters onSearch={jest.fn()} onClear={onClear} />);

  userEvent.type(screen.getByLabelText("City"), "Champaign");
  userEvent.selectOptions(screen.getByLabelText("Beds"), "3");
  userEvent.click(screen.getByRole("button", { name: "Clear" }));

  expect(screen.getByLabelText("City")).toHaveValue("");
  expect(screen.getByLabelText("Beds")).toHaveValue("");
  expect(onClear).toHaveBeenCalledTimes(1);
});
