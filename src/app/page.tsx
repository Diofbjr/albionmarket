/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Server,
  getAvailableCities,
  getItemPrices,
  getItemHistoryPrices,
  ItemHistoryResponse,
} from '@/components/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ServerSelect from '../components/ServerSelect';
import SearchBar from '../components/SearchBar';
import PriceTable from '../components/PriceTable';
import PriceBarChart from '../components/PriceBarChart';
import PriceHistoryChart from '../components/PriceHistoryChart';

type PriceRowFromApi = {
  city: string;
  sell_price_min: number;
  buy_price_max: number;
  quality: number;
};

type CityPrices = {
  city: string;
  pricesByQuality: {
    [quality: number]: {
      sell_price_min: number;
      buy_price_max: number;
    };
  };
};

const groupPricesByCity = (apiData: PriceRowFromApi[]): CityPrices[] => {
  const groupedData: { [city: string]: CityPrices } = {};
  apiData.forEach(row => {
    if (!groupedData[row.city]) {
      groupedData[row.city] = { city: row.city, pricesByQuality: {} };
    }
    groupedData[row.city].pricesByQuality[row.quality] = {
      sell_price_min: row.sell_price_min,
      buy_price_max: row.buy_price_max
    };
  });
  return Object.values(groupedData);
};

type View = 'table' | 'chart' | 'history';

export default function HomePage() {
  const [server, setServer] = useState<Server>('west');
  const [cities, setCities] = useState<string[]>([]);
  const [rows, setRows] = useState<CityPrices[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<View>('table');
  const [selectedQualities, setSelectedQualities] = useState<{ [city: string]: number }>({});
  const [selectedChartQuality, setSelectedChartQuality] = useState<number>(1);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState<{ itemId: string | null; city: string | null; quality: number | null }>({ itemId: null, city: null, quality: null });
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    getAvailableCities(server).then(setCities);
  }, [server]);

  const allAvailableQualities = useMemo(() => {
    const qualities = new Set<number>();
    rows.forEach(cityData => {
      Object.keys(cityData.pricesByQuality)
        .filter(q => cityData.pricesByQuality[Number(q)].sell_price_min > 0)
        .forEach(q => qualities.add(Number(q)));
    });
    return Array.from(qualities).sort((a, b) => a - b);
  }, [rows]);

  const handleItemSelected = async (itemId: string) => {
    setLoading(true);
    try {
      const data = await getItemPrices(server, itemId, cities);
      const groupedData = groupPricesByCity(data);
      setRows(groupedData);
      setSelectedQualities({});

      // Obter todas as qualidades disponíveis a partir dos dados retornados
      const availableQualities = new Set<number>();
      groupedData.forEach(cityData => {
        Object.keys(cityData.pricesByQuality)
          .filter(q => cityData.pricesByQuality[Number(q)].sell_price_min > 0)
          .forEach(q => availableQualities.add(Number(q)));
      });
      const sortedQualities = Array.from(availableQualities).sort((a, b) => a - b);

      // Definir a primeira qualidade disponível como padrão para o gráfico
      if (sortedQualities.length > 0) {
        setSelectedChartQuality(sortedQualities[0]);
      } else {
        setSelectedChartQuality(1);
      }

      // Define um valor inicial para a cidade e a qualidade do histórico
      if (cities.length > 0 && groupedData.length > 0) {
        const cityWithData = groupedData[0].city;
        const firstQuality = sortedQualities[0];
        
        if (cityWithData && firstQuality) {
          setSelectedItemForHistory({
            itemId,
            city: cityWithData,
            quality: firstQuality,
          });
        }
      } else {
        setSelectedItemForHistory({ itemId, city: null, quality: null });
      }
      
      setCurrentView('table'); // <-- Linha modificada para 'table'

    } catch (error) {
      console.error('Failed to fetch prices:', error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQualityChange = (city: string, value: string) => {
    setSelectedQualities(prev => ({
      ...prev,
      [city]: Number(value),
    }));
  };

  const chartData = useMemo(() => {
    return rows.map(cityData => {
      const prices = cityData.pricesByQuality[selectedChartQuality] || {
        sell_price_min: 0,
        buy_price_max: 0,
      };
      
      return {
        city: cityData.city,
        sell_price_min: prices.sell_price_min,
        buy_price_max: prices.buy_price_max,
      };
    }).filter(item => item.sell_price_min > 0);
  }, [rows, selectedChartQuality]);

  const fetchHistoryData = async (city: string, quality: number) => {
    if (selectedItemForHistory.itemId) {
      setLoading(true);
      try {
        const data: ItemHistoryResponse = await getItemHistoryPrices(server, selectedItemForHistory.itemId, city, quality);
        setHistoryData(data.length > 0 ? data[0].data : []);
      } catch (error) {
        console.error('Failed to fetch history prices:', error);
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (currentView === 'history' && selectedItemForHistory.city && selectedItemForHistory.quality) {
      fetchHistoryData(selectedItemForHistory.city, selectedItemForHistory.quality);
    }
  }, [currentView, selectedItemForHistory.city, selectedItemForHistory.quality]);


  return (
    <main className="min-h-screen bg-muted py-10">
      <div className="container mx-auto max-w-5xl px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Pesquisa de mercado do Albion</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="w-full md:w-1/3">
                <ServerSelect server={server} onChange={setServer} />
              </div>
              <div className="w-full md:w-2/3">
                <SearchBar onItemSelected={handleItemSelected} />
              </div>
            </div>
            <Separator />
            <div>
              {loading && <p className="text-center text-muted-foreground text-lg">Carregando...</p>}
              {!loading && rows.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                      <Button
                        variant={currentView === 'table' ? 'default' : 'outline'}
                        onClick={() => setCurrentView('table')}
                      >
                        Tabela
                      </Button>
                      <Button
                        variant={currentView === 'chart' ? 'default' : 'outline'}
                        onClick={() => setCurrentView('chart')}
                      >
                        Gráfico
                      </Button>
                      <Button
                        variant={currentView === 'history' ? 'default' : 'outline'}
                        onClick={() => setCurrentView('history')}
                        disabled
                      >
                        Histórico
                      </Button>
                    </div>
                    {currentView === 'chart' && allAvailableQualities.length > 1 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Qualidade do Gráfico:</span>
                        <Select
                          value={String(selectedChartQuality)}
                          onValueChange={(value) => setSelectedChartQuality(Number(value))}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
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
                    )}
                  </div>
                  {currentView === 'table' ? (
                    <PriceTable rows={rows} selectedQualities={selectedQualities} handleQualityChange={handleQualityChange} />
                  ) : currentView === 'chart' ? (
                    <PriceBarChart data={chartData} />
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <Select
                          onValueChange={(city) => setSelectedItemForHistory(prev => ({ ...prev, city }))}
                          value={selectedItemForHistory.city || ''}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecione a cidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(quality) => setSelectedItemForHistory(prev => ({ ...prev, quality: Number(quality) }))}
                          value={String(selectedItemForHistory.quality || '')}
                        >
                          <SelectTrigger className="w-[120px]">
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
                      <PriceHistoryChart data={historyData} />
                    </>
                  )}
                </div>
              ) : (
                !loading && (
                  <p className="text-center text-muted-foreground text-lg">
                    Pesquise um item para ver os preços.
                  </p>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}