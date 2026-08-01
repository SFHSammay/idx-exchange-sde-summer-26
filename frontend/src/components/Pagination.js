function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage === 1) {
    return [1, 2, "...", totalPages];
  }

  if (currentPage === 2) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage === totalPages - 1) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  if (currentPage === totalPages) {
    return [1, "...", totalPages - 1, totalPages];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Property pages">
      {currentPage > 1 && (
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </button>
      )}

      {pageNumbers.map((pageNumber, index) =>
        pageNumber === "..." ? (
          <span className="pagination-ellipsis" key={`ellipsis-${index}`}>
            ...
          </span>
        ) : (
          <button
            type="button"
            className={pageNumber === currentPage ? "active" : ""}
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        )
      )}

      {currentPage < totalPages && (
        <button
          type="button"
          aria-label="Next page"
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </button>
      )}
    </nav>
  );
}

export { getPageNumbers };
export default Pagination;
