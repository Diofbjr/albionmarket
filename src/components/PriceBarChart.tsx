'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

type PriceData = {
  city: string;
  sell_price_min: number;
  buy_price_max: number;
};

interface PriceBarChartProps {
  data: PriceData[];
}

const chartConfig = {
  venda: {
    label: 'Preço de Venda Mínimo',
    color: 'hsl(142.1 76.2% 36.3%)', // Verde para venda
  },
  compra: {
    label: 'Preço de Compra Máximo',
    color: 'hsl(0 84.2% 60.2%)', // Vermelho para compra
  },
};

export default function PriceBarChart({ data }: PriceBarChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-muted-foreground text-lg">Sem dados de preços para exibir no gráfico.</p>;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="city"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="sell_price_min" name="Preço de Venda Mínimo" fill="hsl(142.1 76.2% 36.3%)" radius={4} />
          <Bar dataKey="buy_price_max" name="Preço de Compra Máximo" fill="hsl(0 84.2% 60.2%)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}