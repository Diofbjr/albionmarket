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
import { chartConfig } from '../../lib/chartConfig';

interface ChartProps {
  data: PriceData[];
}

export default function Chart({ data }: ChartProps) {
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
          <Bar dataKey="sell_price_min" name="Preço de Venda Mínimo" fill={chartConfig.venda.color} radius={4} />
          <Bar dataKey="buy_price_max" name="Preço de Compra Máximo" fill={chartConfig.compra.color} radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}