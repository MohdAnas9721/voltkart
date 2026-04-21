export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;

  const currentPage = Number(pagination.page || 1);
  const totalPages = Number(pagination.pages || 1);

  const getPageItems = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 1) return [1, 2, 3, 'end-ellipsis'];
    if (currentPage === 2) return [1, 2, 3, 4, 'end-ellipsis'];
    if (currentPage === 3) return [1, 2, 3, 4, 5, 'end-ellipsis'];
    if (currentPage >= totalPages - 2) {
      return ['start-ellipsis', ...Array.from({ length: 5 }, (_, index) => totalPages - 4 + index)];
    }

    return ['start-ellipsis', currentPage - 1, currentPage, currentPage + 1, 'end-ellipsis'];
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Product pagination">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      {getPageItems().map((item) => {
        if (typeof item === 'string') {
          return (
            <span key={item} className="grid h-10 min-w-10 place-items-center rounded-md border border-transparent px-2 text-sm font-bold text-slate-400">
              ...
            </span>
          );
        }

        return (
          <button
            key={item}
            type="button"
            onClick={() => goToPage(item)}
            aria-current={currentPage === item ? 'page' : undefined}
            className={`h-10 min-w-10 rounded-md border px-3 text-sm font-semibold ${
              currentPage === item
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-primary-500'
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
