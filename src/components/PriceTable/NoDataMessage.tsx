import { Table, TableCaption } from '@/components/ui/table';

export default function NoDataMessage() {
  return (
    <Table>
      <TableCaption className="mt-8">
        Nenhum dado de preço disponível. Por favor, selecione um item para visualizar as informações.
      </TableCaption>
    </Table>
  );
}