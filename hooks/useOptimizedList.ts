import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface UseOptimizedListProps<T> {
  items: T[];
  getItemId: (item: T) => string;
  searchQuery?: string;
  searchFields?: (keyof T)[];
  filterFn?: (item: T) => boolean;
  sortFn?: (a: T, b: T) => number;
}

export const useOptimizedList = <T extends Record<string, any>>({
  items,
  searchQuery = '',
  searchFields = [],
  filterFn,
  sortFn,
}: UseOptimizedListProps<T>) => {
  // Memoized filtering and searching
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Apply search filter
    if (searchQuery && searchFields.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }

    // Apply custom filter
    if (filterFn) {
      result = result.filter(filterFn);
    }

    // Apply sorting
    if (sortFn) {
      result.sort(sortFn);
    }

    return result;
  }, [items, searchQuery, searchFields, filterFn, sortFn]);

  // Virtual scrolling for large lists
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimate item height
    overscan: 5,
  });

  return {
    filteredItems,
    virtualizer,
    parentRef,
    isEmpty: filteredItems.length === 0,
    totalCount: items.length,
    filteredCount: filteredItems.length,
  };
};

// Debounced search hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};