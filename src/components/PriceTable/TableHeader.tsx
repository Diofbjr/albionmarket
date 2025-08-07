import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { getSortIcon } from '../../lib/tableUtils';
import { SortConfig, SortKey } from '../../types/types';

interface TableHeaderProps {
  sortConfig: SortConfig;
  onRequestSort: (key: SortKey) => void;
}

export default function TableHeader({ sortConfig, onRequestSort }: TableHeaderProps) {
  return (
    <ShadcnTableHeader className="sticky top-0 bg-white">
      <TableRow>
        <TableHead>
          <button
            type="button"
            onClick={() => onRequestSort('city')}
            className={`flex items-center text-left font-medium`}
          >
            Cidade
            {getSortIcon('city', sortConfig)}
          </button>
        </TableHead>
        <TableHead>Qualidade</TableHead>
        <TableHead>
          <button
            type="button"
            onClick={() => onRequestSort('sell_price_min')}
            className={`flex items-center text-left font-medium`}
          >
            Preço de Venda Mínimo
            {getSortIcon('sell_price_min', sortConfig)}
          </button>
        </TableHead>
        <TableHead>
          <button
            type="button"
            onClick={() => onRequestSort('buy_price_max')}
            className={`flex items-center text-left font-medium`}
          >
            Preço de Compra Máximo
            {getSortIcon('buy_price_max', sortConfig)}
          </button>
        </TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
}