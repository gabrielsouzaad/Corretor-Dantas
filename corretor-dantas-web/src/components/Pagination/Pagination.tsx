import "./Pagination.css";

interface PaginationProps {
  page: number; // começa em 0
  totalPages: number;
  onChange: (page: number) => void;
}

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        type="button"
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>

      <span>
        Página {page + 1} de {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Próxima
      </button>
    </nav>
  );
}

export default Pagination;