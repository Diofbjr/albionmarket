'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
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

type CityPrices = {
  city: string;
  pricesByQuality: {
    [quality: number]: {
      sell_price_min: number;
      buy_price_max: number;
    };
  };
};

interface Props {
  rows: CityPrices[];
}

const QUALITIES = [1, 2, 3, 4, 5];

export default function PriceTable({ rows }: Props) {
  const [selectedQualities, setSelectedQualities] = useState<{ [city: string]: number }>({});

  const handleQualityChange = (city: string, quality: number) => {
    setSelectedQualities(prev => ({
      ...prev,
      [city]: quality,
    }));
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cidade</TableHead>
            <TableHead>Qualidade</TableHead>
            <TableHead>Preço de Venda Mínimo</TableHead>
            <TableHead>Preço de Compra Máximo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(cityData => {
            // Garantimos que qualidade padrão seja a selecionada ou 1
            const currentQuality = selectedQualities[cityData.city] || 1;
            const prices = cityData.pricesByQuality[currentQuality];

            return (
              <TableRow key={cityData.city}>
                <TableCell className="font-medium">{cityData.city}</TableCell>
                <TableCell>
                  <Select
                    value={String(currentQuality)}
                    onValueChange={value => handleQualityChange(cityData.city, Number(value))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALITIES.map(q => (
                        <SelectItem key={q} value={String(q)}>
                          Qualidade {q}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{prices?.sell_price_min ?? '-'}</TableCell>
                <TableCell>{prices?.buy_price_max ?? '-'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
