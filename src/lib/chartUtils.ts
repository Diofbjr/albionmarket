import { HistoryDataPoint } from '../types/types';

/**
 * Formata os dados de histórico de preços para exibição em um gráfico.
 * Converte o timestamp para um formato de hora amigável.
 */
export const formatChartData = (data: HistoryDataPoint[]) => {
  return data.map(point => ({
    ...point,
    timestamp: new Date(point.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  }));
};