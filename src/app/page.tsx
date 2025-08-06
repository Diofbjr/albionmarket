/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Server, getAvailableCities, getItemPrices } from '@/components/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ServerSelect from '../components/ServerSelect';
import SearchBar from '../components/SearchBar';
import PriceTable from '../components/PriceTable';

// Definição dos tipos para o novo formato da tabela
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

// Função para agrupar os dados da API por cidade
const groupPricesByCity = (apiData: PriceRowFromApi[]): CityPrices[] => {
  const groupedData: { [city: string]: CityPrices } = {};

  apiData.forEach(row => {
    if (!groupedData[row.city]) {
      groupedData[row.city] = {
        city: row.city,
        pricesByQuality: {}
      };
    }
    groupedData[row.city].pricesByQuality[row.quality] = {
      sell_price_min: row.sell_price_min,
      buy_price_max: row.buy_price_max
    };
  });

  return Object.values(groupedData);
};

export default function HomePage() {
  const [server, setServer] = useState<Server>('west');
  const [cities, setCities] = useState<string[]>([]);
  const [rows, setRows] = useState<CityPrices[]>([]); // Tipo atualizado para CityPrices[]

  useEffect(() => {
    getAvailableCities(server).then(setCities);
  }, [server]);

  const handleItemSelected = async (itemId: string) => {
    try {
      const data = await getItemPrices(server, itemId, cities);
      // Aqui, os dados da API são agrupados antes de serem usados
      const groupedData = groupPricesByCity(data);
      setRows(groupedData);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      setRows([]);
    }
  };

  return (
    <main className="min-h-screen bg-muted py-10">
      <div className="container mx-auto max-w-5xl px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Pesquisa de mercado de Albion</CardTitle>
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
              {rows.length > 0 ? (
                <PriceTable rows={rows} />
              ) : (
                <p className="text-center text-muted-foreground text-lg">
                  Pesquise um item para ver os preços.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}