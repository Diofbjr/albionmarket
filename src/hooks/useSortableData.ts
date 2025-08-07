import { useState, useMemo } from 'react';
import { SortableCityPrices, SortConfig, SortKey } from '../types/types';

export const useSortableData = (
  items: SortableCityPrices[],
  config: SortConfig = null,
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(config);

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = sortConfig.key === 'city'
          ? a[sortConfig.key]
          : a.pricesByQuality?.[a.currentQuality]?.[sortConfig.key];
        
        const bValue = sortConfig.key === 'city'
          ? b[sortConfig.key]
          : b.pricesByQuality?.[b.currentQuality]?.[sortConfig.key];

        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};