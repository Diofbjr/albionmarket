'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { PriceData } from '../../types/types';

interface ChartProps {
  data: PriceData[];
}

const customChartConfig = {
  sell_price_min: {
    label: 'Preço de Venda Mínimo',
    color: 'var(--primary)',
  },
  buy_price_max: {
    label: 'Preço de Compra Máximo',
    color: 'oklch(0.65 0.18 35)',
  },
};

export default function Chart({ data }: ChartProps) {
  return (
    <ChartContainer config={customChartConfig} className="min-h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid vertical={false} className="stroke-border/40" />
          <XAxis
            dataKey="city"
            tickLine={false}
            tickMargin={12}
            axisLine={false}
            className="text-muted-foreground font-medium text-xs"
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            className="text-muted-foreground text-xs"
            tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(value)}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend className="pt-4 text-xs font-medium" />
          <Bar 
            dataKey="sell_price_min" 
            name="Preço de Venda Mínimo" 
            fill={customChartConfig.sell_price_min.color} 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="buy_price_max" 
            name="Preço de Compra Máximo" 
            fill={customChartConfig.buy_price_max.color} 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}