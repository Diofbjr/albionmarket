import { TableCell, TableRow as ShadcnTableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortableCityPrices } from '../../types/types';
import { formatPrice, getHighlightClassAndIcon } from '../../lib/tableUtils';
import React from 'react';

interface TableRowProps {
  cityData: SortableCityPrices;
  index: number;
  handleQualityChange: (city: string, value: string) => void;
  highlightInfo: { minSell: number | null; maxBuy: number | null };
}

export default function TableRow({ cityData, index, handleQualityChange, highlightInfo }: TableRowProps) {
  const currentQuality = cityData.currentQuality;
  const prices = cityData.pricesByQuality[currentQuality];

  if (!prices || prices.sell_price_min <= 0) {
    return null;
  }

  const qualitiesWithPrices = Object.keys(cityData.pricesByQuality)
    .filter(quality => cityData.pricesByQuality[Number(quality)].sell_price_min > 0);

  const { className: sellClassName, icon: sellIcon } = getHighlightClassAndIcon(prices.sell_price_min, 'sell_price_min', highlightInfo);
  const { className: buyClassName, icon: buyIcon } = getHighlightClassAndIcon(prices.buy_price_max, 'buy_price_max', highlightInfo);

  return (
    <ShadcnTableRow className={`transition-colors duration-200 ease-in-out hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
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
    </ShadcnTableRow>
  );
}