'use client';

import { PriceBarChartProps } from '../../types/types';
import Chart from './Chart';
import NoDataMessage from './NoDataMessage';

export default function PriceBarChart({ data }: PriceBarChartProps) {
  if (!data || data.length === 0) {
    return <NoDataMessage />;
  }

  return <Chart data={data} />;
}