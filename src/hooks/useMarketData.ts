import { useState, useEffect, useCallback } from 'react';
import { Server, getAvailableCities, getItemPrices, getItemHistoryPrices } from '@/components/lib/api';
import { 
  CityPrices, 
  HistoryDataPoint, 
  PriceRowFromApi, 
  SelectedHistoryState, 
  ApiHistoryLocationGroup, 
  HTTPDataWrapper 
} from '@/types/types';

export function useMarketData(server: Server, selectedItem: string) {
  const [citiesData, setCitiesData] = useState<CityPrices[]>([]);
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SelectedHistoryState>({
    city: '',
    quality: 1,
  });

  const groupPricesByCity = useCallback((apiData: PriceRowFromApi[]): CityPrices[] => {
    const grouped: Record<string, CityPrices> = {};
    apiData.forEach((row) => {
      if (!grouped[row.city]) {
        grouped[row.city] = { city: row.city, pricesByQuality: {} };
      }
      grouped[row.city].pricesByQuality[row.quality] = {
        sell_price_min: row.sell_price_min,
        buy_price_max: row.buy_price_max,
      };
    });
    return Object.values(grouped);
  }, []);

  // Busca de preços atuais
  useEffect(() => {
    if (!selectedItem) return;

    const fetchPrices = async () => {
      setLoading(true);
      try {
        const cities = await getAvailableCities(server); 
        const response = await getItemPrices(server, selectedItem, cities);
        
        let rawRows: PriceRowFromApi[] = [];
        const rawResponse = response as unknown;

        if (Array.isArray(rawResponse)) {
          rawRows = rawResponse as PriceRowFromApi[];
        } else if (rawResponse && typeof rawResponse === 'object' && 'data' in rawResponse) {
          const wrapped = rawResponse as HTTPDataWrapper;
          if (Array.isArray(wrapped.data)) {
            rawRows = wrapped.data as PriceRowFromApi[];
          }
        }

        const structuredData = groupPricesByCity(rawRows);
        setCitiesData(structuredData);
        
        if (structuredData.length > 0) {
          const firstCity = structuredData[0];
          const availableQualities = Object.keys(firstCity.pricesByQuality).map(Number);
          setSelectedHistoryItem({
            city: firstCity.city,
            quality: availableQualities[0] || 1,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar preços do mercado:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [server, selectedItem, groupPricesByCity]);

  // Busca do histórico
  useEffect(() => {
    if (!selectedItem || !selectedHistoryItem.city) return;

    const fetchHistory = async () => {
      try {
        const response = await getItemHistoryPrices(
          server,
          selectedItem,
          selectedHistoryItem.city,
          selectedHistoryItem.quality
        );
        
        const rawResponse = response as unknown;
        let dataArray: unknown[] = [];

        if (Array.isArray(rawResponse)) {
          dataArray = rawResponse;
        } else if (rawResponse && typeof rawResponse === 'object' && 'data' in rawResponse) {
          const wrapped = rawResponse as HTTPDataWrapper;
          if (Array.isArray(wrapped.data)) {
            dataArray = wrapped.data;
          }
        }

        const typedGroups = dataArray as ApiHistoryLocationGroup[];
        const cityGroup = typedGroups.find(
          (group) => group && group.location === selectedHistoryItem.city
        );

        if (cityGroup && Array.isArray(cityGroup.data)) {
          const mappedHistory: HistoryDataPoint[] = cityGroup.data.map((point) => ({
            timestamp: point.timestamp,
            averagePrice: point.averagePrice,
            itemCount: point.itemCount,
          }));
          setHistoryData(mappedHistory);
        } else {
          setHistoryData([]);
        }
      } catch (error) {
        console.error('Erro ao buscar histórico de preços:', error);
        setHistoryData([]);
      }
    };

    fetchHistory();
  }, [server, selectedItem, selectedHistoryItem]);

  return {
    citiesData,
    historyData,
    loading,
    selectedHistoryItem,
    setSelectedHistoryItem,
  };
}