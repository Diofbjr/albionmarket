// PriceTable.tsx
'use client';

import { useState } from 'react';

// Novo tipo de dado para a tabela.
// pricesByQuality é um objeto onde a chave é a qualidade e o valor é o preço.
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

export default function PriceTable({ rows }: Props) {
  const [selectedQualities, setSelectedQualities] = useState<{ [city: string]: number }>({});

  const handleQualityChange = (city: string, quality: number) => {
    setSelectedQualities(prev => ({
      ...prev,
      [city]: quality
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Cidade
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Qualidade
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Preço de Venda Mínimo
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Preço de Compra Máximo
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((cityData) => {
            const qualitiesWithPrices = Object.keys(cityData.pricesByQuality).filter(
              (quality) => cityData.pricesByQuality[Number(quality)].sell_price_min > 0
            );

            // Se não houver preços para a qualidade selecionada, não renderizamos a linha.
            if (qualitiesWithPrices.length === 0) {
              return null;
            }
            
            // Obtemos a qualidade selecionada para esta cidade, ou a primeira disponível.
            const currentQuality = selectedQualities[cityData.city] || Number(qualitiesWithPrices[0]);
            const prices = cityData.pricesByQuality[currentQuality];

            return (
              <tr key={cityData.city}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cityData.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={currentQuality}
                    onChange={(e) => handleQualityChange(cityData.city, Number(e.target.value))}
                  >
                    {qualitiesWithPrices.map((quality) => (
                      <option key={quality} value={quality}>
                        Qualidade {quality}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prices?.sell_price_min}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prices?.buy_price_max}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}