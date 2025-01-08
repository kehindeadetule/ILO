import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      if (currentPage <= 2) {
        // Show first 5 pages + ellipsis + last page
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page + ellipsis + last 5 pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    } else {
      // Show all pages if total pages <= 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className='flex justify-center items-center gap-2 my-8'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent'
        aria-label='Previous page'>
        <LuChevronLeft className='w-5 h-5' />
      </button>

      <div className='flex gap-2'>
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className='w-10 h-10 flex items-center justify-center'>
                {page}
              </span>
            ) : (
              <button
                onClick={() => onPageChange(Number(page))}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                  ${
                    currentPage === page
                      ? 'bg-[#2F8668] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}>
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent'
        aria-label='Next page'>
        <LuChevronRight className='w-5 h-5' />
      </button>
    </div>
  );
};

export default Pagination;
