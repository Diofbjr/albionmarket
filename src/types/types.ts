export type SearchItem = {
  uniqueName?: string;
  LocalizedNames?: { 'PT-BR'?: string };
  LocalizationNameVariable?: string;
};

export interface SearchBarProps {
  onItemSelected: (itemId: string) => void;
}

export type PriceData = {
  city: string;
  sell_price_min: number;
  buy_price_max: number;
};

export interface PriceBarChartProps {
  data: PriceData[];
}

export type CityPrices = {
  city: string;
  pricesByQuality: {
    [quality: number]: {
      sell_price_min: number;
      buy_price_max: number;
    };
  };
};

export type SortableCityPrices = CityPrices & {
  currentQuality: number;
};

export type SortKey = 'city' | 'sell_price_min' | 'buy_price_max';

export type SortConfig = {
  key: SortKey;
  direction: 'ascending' | 'descending';
} | null;

export interface PriceTableProps {
  rows: CityPrices[];
  selectedQualities: { [city: string]: number };
  handleQualityChange: (city: string, value: string) => void;
}

export type HistoryDataPoint = {
  timestamp: string;
  averagePrice: number;
};

export interface PriceHistoryChartProps {
  data: HistoryDataPoint[];
}

export type Server = 'west' | 'east' | 'europe';

export interface ServerSelectProps {
  server: Server;
  onChange: (server: Server) => void;
}

