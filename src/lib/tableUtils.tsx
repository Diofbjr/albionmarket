import { SortConfig } from '../types/types';
import { FaSort, FaSortUp, FaSortDown, FaArrowDown, FaArrowUp } from 'react-icons/fa';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getHighlightClassAndIcon = (
  value: number,
  columnKey: 'sell_price_min' | 'buy_price_max',
  highlightInfo: { minSell: number | null; maxBuy: number | null }
) => {
  if (columnKey === 'sell_price_min' && value === highlightInfo.minSell) {
    return { 
      className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-1 rounded-md transition-colors', 
      icon: <FaArrowDown className="ml-1 text-emerald-500 animate-pulse text-xs" /> 
    };
  }
  if (columnKey === 'buy_price_max' && value === highlightInfo.maxBuy) {
    return { 
      className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold px-2 py-1 rounded-md transition-colors', 
      icon: <FaArrowUp className="ml-1 text-blue-500 dark:text-blue-400 animate-pulse text-xs" /> 
    };
  }
  return { className: '', icon: null };
};

export const getSortIcon = (name: string, sortConfig: SortConfig) => {
  if (!sortConfig || sortConfig.key !== name) {
    return <FaSort className="ml-1 opacity-40 text-xs text-muted-foreground" />;
  }
  return sortConfig.direction === 'ascending' 
    ? <FaSortUp className="ml-1 text-xs text-primary" /> 
    : <FaSortDown className="ml-1 text-xs text-primary" />;
};