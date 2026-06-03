import styles from "./Pagination.module.css";

interface PaginationProps {
  ariaLabel?: string;
  className?: string;
  onChange: (page: number) => void;
  page: number;
  totalPages: number;
}

export default function Pagination({
  ariaLabel = "Pagination",
  className = "",
  onChange,
  page,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === page) {
      return;
    }

    onChange(targetPage);
  };

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className={`${styles.pagination} ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={styles.button}
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        Prev
      </button>

      <div className={styles.pages}>
        {pages.map((pageNumber) => {
          const isActivePage = pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              className={`${styles.page} ${
                isActivePage ? styles.active : ""
              }`.trim()}
              onClick={() => goToPage(pageNumber)}
              aria-current={isActivePage ? "page" : undefined}
              aria-label={
                isActivePage
                  ? `Current page, page ${pageNumber}`
                  : `Go to page ${pageNumber}`
              }
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
