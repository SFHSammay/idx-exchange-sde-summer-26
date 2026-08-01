import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination, { getPageNumbers } from "./Pagination";

test("hides pagination when there is only one page", () => {
  const { container } = render(
    <Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />
  );

  expect(container).toBeEmptyDOMElement();
});

test("does not show previous button on the first page", () => {
  render(
    <Pagination currentPage={1} totalPages={15} onPageChange={jest.fn()} />
  );

  expect(screen.queryByLabelText("Previous page")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Next page")).toBeInTheDocument();
});

test("does not show next button on the last page", () => {
  render(
    <Pagination currentPage={15} totalPages={15} onPageChange={jest.fn()} />
  );

  expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
  expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
});

test("clicking a page number changes to that page", () => {
  const onPageChange = jest.fn();

  render(
    <Pagination currentPage={1} totalPages={15} onPageChange={onPageChange} />
  );

  userEvent.click(screen.getByRole("button", { name: "2" }));

  expect(onPageChange).toHaveBeenCalledWith(2);
});

test("clicking next changes to the next page", () => {
  const onPageChange = jest.fn();

  render(
    <Pagination currentPage={4} totalPages={15} onPageChange={onPageChange} />
  );

  userEvent.click(screen.getByLabelText("Next page"));

  expect(onPageChange).toHaveBeenCalledWith(5);
});

test("shows ellipsis for middle pages", () => {
  render(
    <Pagination currentPage={8} totalPages={15} onPageChange={jest.fn()} />
  );

  expect(screen.getAllByText("...")).toHaveLength(2);
  expect(screen.getByRole("button", { name: "7" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "8" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument();
});

test("does not duplicate page numbers near the end", () => {
  const pageNumbers = getPageNumbers(14, 15);
  const onlyNumbers = pageNumbers.filter((pageNumber) => pageNumber !== "...");
  const uniqueNumbers = new Set(onlyNumbers);

  expect(uniqueNumbers.size).toBe(onlyNumbers.length);
  expect(pageNumbers).toEqual([1, "...", 13, 14, 15]);
});
