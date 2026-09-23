import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className = '',
}) => {
  if (totalItems === 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`px-4 py-3.5 border-t border-stone-200 bg-stone-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 ${className}`}
    >
      {/* Left side: Item count & Page size selector */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="text-stone-600 font-medium">
          Menampilkan <strong className="text-stone-900 font-bold">{startItem}</strong> -{' '}
          <strong className="text-stone-900 font-bold">{endItem}</strong> dari{' '}
          <strong className="text-stone-900 font-bold">{totalItems}</strong> data
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-stone-500">
            <span>Baris per hal:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="px-2 py-1 bg-white border border-stone-300 rounded-md font-semibold text-stone-800 focus:outline-none focus:border-emerald-600 text-xs shadow-2xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right side: Navigation buttons & page pills */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
        {/* First page button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-stone-700 shadow-2xs"
          title="Halaman Pertama"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium text-stone-700 shadow-2xs"
          title="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden md:inline">Prev</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-stone-400 font-bold select-none"
                >
                  &hellip;
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-colors shadow-2xs ${
                  isActive
                    ? 'bg-emerald-800 text-white border border-emerald-800'
                    : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium text-stone-700 shadow-2xs"
          title="Halaman Selanjutnya"
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-stone-700 shadow-2xs"
          title="Halaman Terakhir"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
