'use client';

import { useMemo } from 'react';
import { Table, TableBody, TableCaption } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { PriceTableProps, SortableCityPrices } from '../../types/types';
import { useSortableData } from '../../hooks/useSortableData';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import NoDataMessage from './NoDataMessage';

export default function PriceTable({ rows, selectedQualities, handleQualityChange }: PriceTableProps) {
  const rowsWithQualities = useMemo(() => {
    if (!rows) return [];

    return rows.map(cityData => {
      const qualitiesWithPrices = Object.keys(cityData.pricesByQuality)
        .filter((quality) => cityData.pricesByQuality[Number(quality)].sell_price_min > 0)
        .map(Number);
      
      const currentQuality = selectedQualities[cityData.city] || qualitiesWithPrices[0];
      return { ...cityData, currentQuality };
    }).filter(cityData => cityData.currentQuality !== undefined) as SortableCityPrices[];
  }, [rows, selectedQualities]);

  const { items, requestSort, sortConfig } = useSortableData(rowsWithQualities);

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

  if (!rows || rows.length === 0) {
    return <NoDataMessage />;
  }

  return (
    <Card className="overflow-x-auto rounded-lg border">
      <CardContent className="p-0">
        <Table>
          <TableCaption>Tabela de preços por cidade e qualidade. Clique nos cabeçalhos para ordenar. O preço de venda ideal para lucro é o **menor**, e o preço de compra ideal é o **maior**.</TableCaption>
          <TableHeader sortConfig={sortConfig} onRequestSort={requestSort} />
          <TableBody>
            {items.map((cityData, index) => (
              <TableRow
                key={cityData.city}
                cityData={cityData}
                index={index}
                handleQualityChange={handleQualityChange}
                highlightInfo={highlightInfo}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}