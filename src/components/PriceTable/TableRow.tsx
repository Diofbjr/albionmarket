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
    <ShadcnTableRow 
      className={`transition-colors duration-200 border-b border-border/50 hover:bg-muted/60 ${
        index % 2 === 0 ? 'bg-muted/20' : 'bg-transparent'
      }`}
    >
      <TableCell className="font-semibold text-foreground tracking-tight">{cityData.city}</TableCell>
      <TableCell>
        <Select
          value={String(currentQuality)}
          onValueChange={(value) => handleQualityChange(cityData.city, value)}
        >
          <SelectTrigger className="w-[160px] bg-background border-input focus:ring-2 focus:ring-ring transition-all">
            <SelectValue placeholder="Qualidade" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-popover-foreground">
            {qualitiesWithPrices.map((quality) => (
              <SelectItem key={quality} value={quality} className="focus:bg-accent focus:text-accent-foreground">
                Qualidade {quality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className={`${sellClassName} font-medium`}>
        <div className="flex items-center gap-1.5">
          <span>{formatPrice(prices.sell_price_min)}</span>
          {sellIcon}
        </div>
      </TableCell>
      <TableCell className={`${buyClassName} font-medium`}>
        <div className="flex items-center gap-1.5">
          <span>{formatPrice(prices.buy_price_max)}</span>
          {buyIcon}
        </div>
      </TableCell>
    </ShadcnTableRow>
  );
}