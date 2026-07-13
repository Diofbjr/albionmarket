'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PriceHistoryChart from '../PriceHistoryChart/PriceHistoryChart';
import { CityPrices, HistoryDataPoint } from '@/types/types';

interface SelectedHistoryState {
  city: string;
  quality: number;
}

interface HistoryTabContentProps {
  citiesData: CityPrices[];
  historyData: HistoryDataPoint[];
  selectedHistoryItem: SelectedHistoryState;
  setSelectedHistoryItem: React.Dispatch<React.SetStateAction<SelectedHistoryState>>;
  allAvailableQualities: number[];
}

export default function HistoryTabContent({
  citiesData,
  historyData,
  selectedHistoryItem,
  setSelectedHistoryItem,
  allAvailableQualities,
}: HistoryTabContentProps) {
  return (
    <Card className="border border-border bg-card shadow-sm rounded-xl">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <CardTitle className="text-base font-bold">Histórico Recente</CardTitle>
          <CardDescription>Flutuação temporal de preços detetada pela API</CardDescription>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtro de Cidade */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Cidade:</span>
            <Select
              onValueChange={(city) => setSelectedHistoryItem(prev => ({ ...prev, city }))}
              value={selectedHistoryItem.city}
            >
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                {citiesData.map((c) => (
                  <SelectItem key={c.city} value={c.city}>
                    {c.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Qualidade */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Qualidade:</span>
            <Select
              onValueChange={(quality) => setSelectedHistoryItem(prev => ({ ...prev, quality: Number(quality) }))}
              value={String(selectedHistoryItem.quality)}
            >
              <SelectTrigger className="w-[130px] bg-background">
                <SelectValue placeholder="Qualidade" />
              </SelectTrigger>
              <SelectContent>
                {allAvailableQualities.map((quality) => (
                  <SelectItem key={quality} value={String(quality)}>
                    Qualidade {quality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <PriceHistoryChart data={historyData} />
      </CardContent>
    </Card>
  );
}