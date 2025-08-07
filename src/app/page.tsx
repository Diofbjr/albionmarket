/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
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

// Importando os tipos e componentes conforme o seu exemplo
import ServerSelect from '../components/ServerSelect/ServerSelect';
import SearchBar from '../components/SearchBar/SearchBar';
import PriceTable from '../components/PriceTable/PriceTable';
import PriceBarChart from '../components/PriceBarChart/PriceBarChart';
import PriceHistoryChart from '../components/PriceHistoryChart/PriceHistoryChart';
import { CityPrices, HistoryDataPoint, PriceData } from '@/types/types';

// O tipo de dados retornado diretamente da API de preços
type PriceRowFromApi = {
  city: string;
  sell_price_min: number;
  buy_price_max: number;
  quality: number;
};

/**
 * Agrupa os dados de preços da API por cidade e qualidade.
 * @param apiData A lista de preços brutos da API.
 * @returns Uma lista de objetos CityPrices, cada um contendo preços agrupados por cidade e qualidade.
 */
const groupPricesByCity = (apiData: PriceRowFromApi[]): CityPrices[] => {
  const groupedData: { [city: string]: CityPrices } = {};
  apiData.forEach(row => {
    // Inicializa o objeto para a cidade se ele ainda não existir
    if (!groupedData[row.city]) {
      groupedData[row.city] = { city: row.city, pricesByQuality: {} };
    }
    // Adiciona o preço para a qualidade específica
    groupedData[row.city].pricesByQuality[row.quality] = {
      sell_price_min: row.sell_price_min,
      buy_price_max: row.buy_price_max
    };
  });
  return Object.values(groupedData);
};

type View = 'table' | 'chart' | 'history';

export default function HomePage() {
  // Estado para a seleção do servidor e lista de cidades
  const [server, setServer] = useState<Server>('west');
  const [cities, setCities] = useState<string[]>([]);

  // Estado para os dados de preços do item atual e o estado de carregamento
  const [pricesData, setPricesData] = useState<CityPrices[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado para a visualização atual (tabela, gráfico, histórico)
  const [currentView, setCurrentView] = useState<View>('table');

  // Estado para a seleção de qualidade para a tabela e o gráfico
  const [selectedTableQualities, setSelectedTableQualities] = useState<{ [city: string]: number }>({});
  const [selectedChartQuality, setSelectedChartQuality] = useState<number>(1);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<{ itemId: string | null; city: string | null; quality: number | null }>({ itemId: null, city: null, quality: null });

  // Estado para os dados do gráfico de histórico
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([]);

  // Efeito para buscar as cidades disponíveis quando o servidor muda
  useEffect(() => {
    getAvailableCities(server).then(setCities);
  }, [server]);

  // Memoriza todas as qualidades disponíveis a partir dos dados de preços
  const allAvailableQualities = useMemo(() => {
    const qualities = new Set<number>();
    pricesData.forEach(cityData => {
      Object.keys(cityData.pricesByQuality).forEach(q => {
        // Filtra qualidades que têm preços de venda
        if (cityData.pricesByQuality[Number(q)].sell_price_min > 0) {
          qualities.add(Number(q));
        }
      });
    });
    return Array.from(qualities).sort((a, b) => a - b);
  }, [pricesData]);

  // Função para lidar com a seleção de um novo item
  const handleItemSelected = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      const data = await getItemPrices(server, itemId, cities);
      const groupedData = groupPricesByCity(data);
      setPricesData(groupedData);

      // Limpa as seleções de qualidade anteriores
      setSelectedTableQualities({});
      
      // Obtém as qualidades disponíveis para o novo item
      const qualitiesForNewItem = Array.from(
        new Set(
          groupedData.flatMap(cityData =>
            Object.keys(cityData.pricesByQuality).map(Number)
          ).filter(quality =>
            groupedData.some(cityData =>
              cityData.pricesByQuality[quality]?.sell_price_min > 0
            )
          )
        )
      ).sort((a, b) => a - b);

      // Define a primeira qualidade disponível como padrão para o gráfico
      if (qualitiesForNewItem.length > 0) {
        setSelectedChartQuality(qualitiesForNewItem[0]);
      } else {
        setSelectedChartQuality(1);
      }

      // Define o item, cidade e qualidade padrão para o histórico
      const firstCityWithData = groupedData.find(cityData => Object.values(cityData.pricesByQuality).some(p => p.sell_price_min > 0))?.city || null;
      setSelectedHistoryItem({
        itemId,
        city: firstCityWithData,
        quality: qualitiesForNewItem[0] || null,
      });

      setCurrentView('table');
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      setPricesData([]);
    } finally {
      setLoading(false);
    }
  }, [server, cities]);

  // Função para lidar com a mudança de qualidade na tabela
  const handleTableQualityChange = (city: string, value: string) => {
    setSelectedTableQualities(prev => ({
      ...prev,
      [city]: Number(value),
    }));
  };

  // Dados do gráfico de barras, memorizados para otimização
  const chartData = useMemo<PriceData[]>(() => {
    return pricesData
      .map(cityData => {
        const prices = cityData.pricesByQuality[selectedChartQuality] || { sell_price_min: 0, buy_price_max: 0 };
        return {
          city: cityData.city,
          sell_price_min: prices.sell_price_min,
          buy_price_max: prices.buy_price_max,
        };
      })
      .filter(item => item.sell_price_min > 0);
  }, [pricesData, selectedChartQuality]);

  // Função para buscar dados de histórico
  const fetchHistoryData = useCallback(async () => {
    const { itemId, city, quality } = selectedHistoryItem;
    if (itemId && city && quality) {
      setLoading(true);
      try {
        const data: ItemHistoryResponse = await getItemHistoryPrices(server, itemId, city, quality);
        setHistoryData(data.length > 0 ? data[0].data : []);
      } catch (error) {
        console.error('Failed to fetch history prices:', error);
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedHistoryItem, server]);

  // Efeito para buscar dados de histórico quando a visualização ou a seleção de histórico mudam
  useEffect(() => {
    if (currentView === 'history') {
      fetchHistoryData();
    }
  }, [currentView, fetchHistoryData]);

  return (
    <main className="min-h-screen bg-muted py-10 font-sans">
      <div className="container mx-auto max-w-5xl px-4">
        <Card className="shadow-lg rounded-xl border-none">
          <CardHeader>
            <CardTitle className="text-4xl text-center font-bold text-primary-foreground">
              Albion Market Research
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-8 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="w-full md:w-1/3">
                <ServerSelect server={server} onChange={setServer} />
              </div>
              <div className="w-full md:w-2/3">
                <SearchBar onItemSelected={handleItemSelected} />
              </div>
            </div>
            <Separator />
            <div className="min-h-[400px]">
              {loading ? (
                <p className="text-center text-muted-foreground text-xl animate-pulse">Carregando...</p>
              ) : pricesData.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={currentView === 'table' ? 'default' : 'outline'}
                        onClick={() => setCurrentView('table')}
                      >
                        Tabela
                      </Button>
                      <Button
                        variant={currentView === 'chart' ? 'default' : 'outline'}
                        onClick={() => setCurrentView('chart')}
                        disabled={chartData.length === 0}
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
                        <span className="text-sm text-gray-600">Qualidade:</span>
                        <Select
                          value={String(selectedChartQuality)}
                          onValueChange={(value) => setSelectedChartQuality(Number(value))}
                        >
                          <SelectTrigger className="w-[120px] rounded-md">
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
                    )}
                  </div>
                  {currentView === 'table' && (
                    <PriceTable
                      rows={pricesData}
                      selectedQualities={selectedTableQualities}
                      handleQualityChange={handleTableQualityChange}
                    />
                  )}
                  {currentView === 'chart' && <PriceBarChart data={chartData} />}
                  {currentView === 'history' && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-600">Cidade:</span>
                        <Select
                          onValueChange={(city) => setSelectedHistoryItem(prev => ({ ...prev, city }))}
                          value={selectedHistoryItem.city || ''}
                        >
                          <SelectTrigger className="w-[180px] rounded-md">
                            <SelectValue placeholder="Selecione a cidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {pricesData.map((data) => (
                              <SelectItem key={data.city} value={data.city}>
                                {data.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span className="text-sm text-gray-600">Qualidade:</span>
                        <Select
                          onValueChange={(quality) => setSelectedHistoryItem(prev => ({ ...prev, quality: Number(quality) }))}
                          value={String(selectedHistoryItem.quality || '')}
                        >
                          <SelectTrigger className="w-[120px] rounded-md">
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
                    </div>
                  )}
                </div>
              ) : (
                !loading && (
                  <p className="text-center text-muted-foreground text-xl">
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
