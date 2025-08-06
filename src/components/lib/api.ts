import axios from 'axios';

const SERVER_URLS = {
  west: 'https://west.albion-online-data.com',
  east: 'https://east.albion-online-data.com',
  europe: 'https://europe.albion-online-data.com',
};

export type Server = keyof typeof SERVER_URLS;

// Tipo de retorno esperado da API para preços atuais, agora com a propriedade `quality`.
export type ItemPricesResponse = {
  city: string;
  sell_price_min: number;
  buy_price_max: number;
  quality: number; // A propriedade `quality` foi adicionada aqui.
}[];

// Tipo de retorno esperado da API para histórico de preços.
export type ItemHistoryResponse = {
  location: string;
  itemTypeId: string;
  qualityLevel: number;
  data: {
    itemCount: number;
    averagePrice: number;
    timestamp: string;
  }[];
}[];

export async function getAvailableCities(server: Server): Promise<string[]> {
  // Não existe um endpoint específico para listar cidades.
  // A lista fixa abaixo inclui as principais cidades do mercado, agora com Brecilien.
  return ['Caerleon', 'Bridgewatch', 'Martlock', 'FortSterling', 'Thetford', 'Lymhurst', 'Brecilien'];
}

export async function getItemPrices(
  server: Server,
  itemName: string,
  cities: string[]
): Promise<ItemPricesResponse> {
  const itemId = itemName.toUpperCase().replace(/ /g, '_');
  const resp = await axios.get(
    `${SERVER_URLS[server]}/api/v2/stats/prices/${itemId}.json`,
    { params: { locations: cities.join(','), qualities: '1,2,3,4,5,6' } }
  );

  return resp.data;
}

// Função para buscar o histórico de preços de um item específico, cidade e qualidade.
export async function getItemHistoryPrices(
  server: Server,
  itemName: string,
  city: string,
  quality: number
): Promise<ItemHistoryResponse> {
  const itemId = itemName.toUpperCase().replace(/ /g, '_');
  const resp = await axios.get(
    `${SERVER_URLS[server]}/api/v2/stats/history/${itemId}.json`,
    { params: { locations: city, qualities: quality, 'time-scale': 1 } }
  );
  return resp.data;
}