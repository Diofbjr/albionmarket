'use client';

import { useState, useMemo } from 'react';
import { Server } from '@/components/lib/api';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Table, History } from 'lucide-react';

import MarketHeader from '../components/MarketHeader/MarketHeader';
import HistoryTabContent from '../components/HistoryTabContent/HistoryTabContent';
import PriceTable from '../components/PriceTable/PriceTable';
import PriceBarChart from '../components/PriceBarChart/PriceBarChart';
import { useMarketData } from '@/hooks/useMarketData';
import { PriceData } from '@/types/types';

export default function MarketPage() {
  const [server, setServer] = useState<Server>('west');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [selectedQualities, setSelectedQualities] = useState<Record<string, number>>({});
  
  // Consumindo a lógica isolada do nosso hook customizado
  const {
    citiesData,
    historyData,
    loading,
    selectedHistoryItem,
    setSelectedHistoryItem,
  } = useMarketData(server, selectedItem);

  // Memoiza os dados formatados para o gráfico de barras
  const chartData = useMemo<PriceData[]>(() => {
    return citiesData.map((cityData) => {
      const qualitiesWithPrices = Object.keys(cityData.pricesByQuality).map(Number);
      const currentQuality = selectedQualities[cityData.city] || qualitiesWithPrices[0];
      const prices = cityData.pricesByQuality[currentQuality];

      return {
        city: cityData.city,
        sell_price_min: prices?.sell_price_min || 0,
        buy_price_max: prices?.buy_price_max || 0,
      };
    }).filter(item => item.sell_price_min > 0);
  }, [citiesData, selectedQualities]);

  // Lista todas as qualidades únicas encontradas
  const allAvailableQualities = useMemo<number[]>(() => {
    const qualitiesSet = new Set<number>();
    citiesData.forEach((city) => {
      Object.keys(city.pricesByQuality).forEach((q) => qualitiesSet.add(Number(q)));
    });
    return Array.from(qualitiesSet).sort((a, b) => a - b);
  }, [citiesData]);

  const handleQualityChange = (city: string, value: string) => {
    setSelectedQualities((prev) => ({ ...prev, [city]: Number(value) }));
  };

  return (
    <main className="space-y-6 animate-in fade-in duration-500">
      <MarketHeader server={server} setServer={setServer} setSelectedItem={setSelectedItem} />

      <Separator className="bg-border/60" />

      <div className="w-full">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {!loading && selectedItem && citiesData.length > 0 ? (
          <Tabs defaultValue="table" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList className="grid grid-cols-3 w-[400px] bg-muted/60 p-1 rounded-xl">
                <TabsTrigger value="table" className="flex items-center gap-1.5 rounded-lg text-xs font-semibold">
                  <Table className="w-3.5 h-3.5" /> Tabela
                </TabsTrigger>
                <TabsTrigger value="chart" className="flex items-center gap-1.5 rounded-lg text-xs font-semibold">
                  <BarChart3 className="w-3.5 h-3.5" /> Gráfico
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-1.5 rounded-lg text-xs font-semibold">
                  <History className="w-3.5 h-3.5" /> Histórico
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="table" className="focus-visible:outline-none">
              <PriceTable rows={citiesData} selectedQualities={selectedQualities} handleQualityChange={handleQualityChange} />
            </TabsContent>

            <TabsContent value="chart" className="focus-visible:outline-none">
              <Card className="border border-border bg-card shadow-sm p-6 rounded-xl">
                <PriceBarChart data={chartData} />
              </Card>
            </TabsContent>

            <TabsContent value="history" className="focus-visible:outline-none">
              <HistoryTabContent 
                citiesData={citiesData} 
                historyData={historyData} 
                selectedHistoryItem={selectedHistoryItem} 
                setSelectedHistoryItem={setSelectedHistoryItem} 
                allAvailableQualities={allAvailableQualities} 
              />
            </TabsContent>
          </Tabs>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-card border border-border rounded-xl shadow-sm">
              <p className="text-muted-foreground text-base font-medium">
                Pesquise um item acima para carregar o Dashboard de inteligência de mercado.
              </p>
            </div>
          )
        )}
      </div>
    </main>
  );
}