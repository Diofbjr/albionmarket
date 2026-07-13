import { Search } from 'lucide-react';

export default function NoDataMessage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-border/60 rounded-xl bg-muted/10 animate-fade-in">
      <div className="p-4 rounded-full bg-muted/50 text-muted-foreground/70 mb-4 shadow-sm border border-border/40">
        <Search className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-foreground tracking-tight">Nenhum dado encontrado</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-xs">
        Selecione outro item ou altere os filtros para visualizar a precificação de mercado.
      </p>
    </div>
  );
}