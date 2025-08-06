'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { FaSort, FaSortUp, FaSortDown, FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Tipo de dado original para a tabela.
type CityPrices = {
  city: string;
  pricesByQuality: {
    [quality: number]: {
      sell_price_min: number;
      buy_price_max: number;
    };
  };
};

// Novo tipo que o hook usará, combinando CityPrices com a propriedade 'currentQuality'.
type SortableCityPrices = CityPrices & {
  currentQuality: number;
};

interface Props {
  rows: CityPrices[];
}

// Hook personalizado para lógica de ordenação
const useSortableData = (
  items: SortableCityPrices[],
  config: { key: 'city' | 'sell_price_min' | 'buy_price_max'; direction: 'ascending' | 'descending' } | null = null,
) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = sortConfig.key === 'city' ? a[sortConfig.key] : a.pricesByQuality?.[a.currentQuality]?.[sortConfig.key];
        const bValue = sortConfig.key === 'city' ? b[sortConfig.key] : b.pricesByQuality?.[b.currentQuality]?.[sortConfig.key];

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

  const requestSort = (key: 'city' | 'sell_price_min' | 'buy_price_max') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

export default function PriceTable({ rows }: Props) {
  const [selectedQualities, setSelectedQualities] = useState<{ [city: string]: number }>({});

  const rowsWithQualities = useMemo(() => {
    return rows.map(cityData => {
      const qualitiesWithPrices = Object.keys(cityData.pricesByQuality)
        .filter((quality) => cityData.pricesByQuality[Number(quality)].sell_price_min > 0)
        .map(Number);

      const currentQuality = selectedQualities[cityData.city] || qualitiesWithPrices[0];
      return { ...cityData, currentQuality };
    }).filter(cityData => cityData.currentQuality !== undefined) as SortableCityPrices[];
  }, [rows, selectedQualities]);

  const { items, requestSort, sortConfig } = useSortableData(rowsWithQualities);

  // Alteração aqui: style foi alterado para 'decimal' para remover o R$
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const highlightInfo = useMemo(() => {
    if (!items || items.length === 0) {
      return { minSell: null, maxBuy: null };
    }

    const validItems = items.filter(item => {
      const prices = item.pricesByQuality[item.currentQuality];
      return prices && prices.sell_price_min > 0;
    });

    if (validItems.length === 0) {
      return { minSell: null, maxBuy: null };
    }

    const minSellPrice = Math.min(...validItems.map(item => item.pricesByQuality[item.currentQuality].sell_price_min));
    const maxBuyPrice = Math.max(...validItems.map(item => item.pricesByQuality[item.currentQuality].buy_price_max));

    return {
      minSell: minSellPrice,
      maxBuy: maxBuyPrice,
    };
  }, [items]);

  const getHighlightClassAndIcon = (value: number, columnKey: 'sell_price_min' | 'buy_price_max') => {
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

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return '';
    }
    return sortConfig.key === name ? sortConfig.direction : '';
  };

  const getSortIcon = (name: string) => {
    if (sortConfig?.key !== name) {
      return <FaSort className="inline ml-1" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <FaSortUp className="inline ml-1" />;
    }
    return <FaSortDown className="inline ml-1" />;
  };

  const handleQualityChange = (city: string, value: string) => {
    setSelectedQualities(prev => ({
      ...prev,
      [city]: Number(value),
    }));
  };

  return (
    <Card className="overflow-x-auto rounded-lg border">
      <CardContent className="p-0">
        <Table>
          <TableCaption>Tabela de preços por cidade e qualidade. Clique nos cabeçalhos para ordenar. O preço de venda ideal para lucro é o **menor**, e o preço de compra ideal é o **maior**.</TableCaption>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead>
                <button
                  type="button"
                  onClick={() => requestSort('city')}
                  className={`flex items-center text-left font-medium ${getClassNamesFor('city')}`}
                >
                  Cidade
                  {getSortIcon('city')}
                </button>
              </TableHead>
              <TableHead>Qualidade</TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => requestSort('sell_price_min')}
                  className={`flex items-center text-left font-medium ${getClassNamesFor('sell_price_min')}`}
                >
                  Preço de Venda Mínimo
                  {getSortIcon('sell_price_min')}
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  onClick={() => requestSort('buy_price_max')}
                  className={`flex items-center text-left font-medium ${getClassNamesFor('buy_price_max')}`}
                >
                  Preço de Compra Máximo
                  {getSortIcon('buy_price_max')}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((cityData, index) => {
              const currentQuality = cityData.currentQuality;
              const prices = cityData.pricesByQuality[currentQuality];

              if (!prices || prices.sell_price_min <= 0) {
                return null;
              }

              const qualitiesWithPrices = Object.keys(cityData.pricesByQuality)
                .filter(quality => cityData.pricesByQuality[Number(quality)].sell_price_min > 0);

              const { className: sellClassName, icon: sellIcon } = getHighlightClassAndIcon(prices.sell_price_min, 'sell_price_min');
              const { className: buyClassName, icon: buyIcon } = getHighlightClassAndIcon(prices.buy_price_max, 'buy_price_max');

              return (
                <TableRow
                  key={cityData.city}
                  className={`transition-colors duration-200 ease-in-out hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                >
                  <TableCell className="font-medium">{cityData.city}</TableCell>
                  <TableCell>
                    <Select
                      value={String(currentQuality)}
                      onValueChange={(value) => handleQualityChange(cityData.city, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Qualidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualitiesWithPrices.map((quality) => (
                          <SelectItem key={quality} value={quality}>
                            Qualidade {quality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className={sellClassName}>
                    <div className="flex items-center">
                      {formatPrice(prices.sell_price_min)}
                      {sellIcon}
                    </div>
                  </TableCell>
                  <TableCell className={buyClassName}>
                    <div className="flex items-center">
                      {formatPrice(prices.buy_price_max)}
                      {buyIcon}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}