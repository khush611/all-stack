interface PaginationProps {
    currentPage: number
    totalPages: number
    onPrevious: () => void
    onNext: () => void
  }
  
  export function Pagination({
    currentPage,
    totalPages,
    onPrevious,
    onNext,
  }: PaginationProps) {
    return (
      <nav
        className="flex items-center justify-between mt-6"
        aria-label="Pagination"
      >
        <p className="text-sm text-gray-600">
          Page <span className="font-semibold">{currentPage + 1}</span> of{' '}
          <span className="font-semibold">{totalPages}</span>
        </p>
  
        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium
                       hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Go to previous page"
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium
                       hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Go to next page"
          >
            Next →
          </button>
        </div>
      </nav>
    )
  }
  