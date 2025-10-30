import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
}

export function usePagination<T>({ items, itemsPerPage = 10 }: UsePaginationProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentPage = useMemo(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    if (totalPages === 0) return 1; // if no data still show page 1
    return Math.max(1, Math.min(pageFromUrl, totalPages)); // if page from url is too big, redirect to last page
  }, [searchParams, totalPages]);

  // Fix invalid page in URL (replace history so back button works correctly)
  useEffect(() => {
    const pageStr = searchParams.get('page');
    const pageNum = parseInt(pageStr || '1', 10);
    const validPage = totalPages === 0 ? 1 : Math.max(1, Math.min(pageNum, totalPages));

    // Only update if the page in URL is invalid or missing
    if (pageNum !== validPage || !pageStr) {
      setSearchParams({ page: validPage.toString() }, { replace: true });
    }
  }, [searchParams, totalPages, setSearchParams]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setSearchParams({ page: page.toString() });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return {
    paginatedItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}
