'use client';

import { PriceHistoryChartProps } from '../../types/types';
import { formatChartData } from '../../lib/chartUtils';
import Chart from './Chart';
import NoDataMessage from './NoDataMessage';

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  if (!data || data.length === 0) {
    return <NoDataMessage />;
  }

  const formattedData = formatChartData(data);

  return <Chart data={formattedData} />;
}