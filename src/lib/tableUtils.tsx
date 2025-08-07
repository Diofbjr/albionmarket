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
  if (columnKey === 'sell_price_min') {
    if (value === highlightInfo.minSell) {
      return { className: 'bg-green-100 text-green-800 font-bold', icon: <FaArrowDown className="ml-1 text-green-500" /> };
    }
  }
  if (columnKey === 'buy_price_max') {
    if (value === highlightInfo.maxBuy) {
      return { className: 'bg-green-100 text-green-800 font-bold', icon: <FaArrowUp className="ml-1 text-green-500" /> };
    }
  }
  return { className: '', icon: null };
};

export const getSortIcon = (name: string, sortConfig: SortConfig) => {
  if (sortConfig?.key !== name) {
    return <FaSort className="inline ml-1" />;
  }
  if (sortConfig.direction === 'ascending') {
    return <FaSortUp className="inline ml-1" />;
  }
  return <FaSortDown className="inline ml-1" />;
};