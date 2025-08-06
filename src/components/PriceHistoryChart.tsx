import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type HistoryDataPoint = {
  timestamp: string;
  averagePrice: number;
};

type PriceHistoryChartProps = {
  data: HistoryDataPoint[];
};

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {

  if (!data || data.length === 0) {
    return <p className="text-center text-muted-foreground text-lg">Nenhum dado de histórico disponível para as últimas 24 horas.</p>;
  }

  // Formatar o timestamp para exibir a hora no eixo X.
  const formattedData = data.map(point => ({
    ...point,
    timestamp: new Date(point.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="averagePrice" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}