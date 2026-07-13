import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { getSortIcon } from '../../lib/tableUtils';
import { SortConfig, SortKey } from '../../types/types';

interface TableHeaderProps {
  sortConfig: SortConfig;
  onRequestSort: (key: SortKey) => void;
}

export default function TableHeader({ sortConfig, onRequestSort }: TableHeaderProps) {
  return (
    <ShadcnTableHeader className="sticky top-0 bg-card border-b border-border transition-colors">
      <TableRow className="hover:bg-transparent border-b border-border">
        <TableHead className="text-muted-foreground font-semibold">
          <button
            type="button"
            onClick={() => onRequestSort('city')}
            className="flex items-center gap-1 text-left font-semibold hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
          >
            Cidade
            {getSortIcon('city', sortConfig)}
          </button>
        </TableHead>
        <TableHead className="text-muted-foreground font-semibold">Qualidade</TableHead>
        <TableHead className="text-muted-foreground font-semibold">
          <button
            type="button"
            onClick={() => onRequestSort('sell_price_min')}
            className="flex items-center gap-1 text-left font-semibold hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
          >
            Preço de Venda Mínimo
            {getSortIcon('sell_price_min', sortConfig)}
          </button>
        </TableHead>
        <TableHead className="text-muted-foreground font-semibold">
          <button
            type="button"
            onClick={() => onRequestSort('buy_price_max')}
            className="flex items-center gap-1 text-left font-semibold hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
          >
            Preço de Compra Máximo
            {getSortIcon('buy_price_max', sortConfig)}
          </button>
        </TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
}