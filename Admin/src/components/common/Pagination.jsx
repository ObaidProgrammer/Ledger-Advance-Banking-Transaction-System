const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPages = () => {
    const visiblePages = [];

    if (pages <= 5) {
      for (let i = 1; i <= pages; i++) {
        visiblePages.push(i);
      }
      return visiblePages;
    }

    if (page <= 3) {
      visiblePages.push(1, 2, 3, 4, 5, "...", pages);
    } else if (page >= pages - 2) {
      visiblePages.push(
        1,
        "...",
        pages - 4,
        pages - 3,
        pages - 2,
        pages - 1,
        pages
      );
    } else {
      visiblePages.push(
        1,
        "...",
        page - 1,
        page,
        page + 1,
        "...",
        pages
      );
    }

    return visiblePages;
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <nav>
        <ul className="pagination">

          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </button>
          </li>

          {getPages().map((item, index) =>
            item === "..." ? (
              <li key={index} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li
                key={index}
                className={`page-item ${page === item ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </button>
              </li>
            )
          )}

          <li className={`page-item ${page === pages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </button>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Pagination;