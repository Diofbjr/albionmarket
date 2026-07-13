'use client';

import {
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { SearchItem } from '../../types/types';
import { getDisplayValue } from '../../lib/searchUtils';

interface SearchResultsProps {
  suggestions: SearchItem[];
  query: string;
  onSelect: (item: SearchItem) => void;
}

export default function SearchResults({ suggestions, query, onSelect }: SearchResultsProps) {
  return (
    <CommandList className="absolute top-full left-0 z-50 w-full mt-2 bg-popover border border-border rounded-xl shadow-xl max-h-64 overflow-y-auto p-1 animate-in fade-in-50 slide-in-from-top-1 duration-200">
      {suggestions.length === 0 && query.length > 0 ? (
        <CommandEmpty className="p-4 text-center text-sm text-muted-foreground">
          Nenhum item encontrado.
        </CommandEmpty>
      ) : (
        <CommandGroup>
          {suggestions.map((item, index) => (
            <CommandItem
              key={index}
              value={getDisplayValue(item)}
              onSelect={() => onSelect(item)}
              className="flex items-center px-3 py-2.5 my-0.5 rounded-lg cursor-pointer text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
            >
              {getDisplayValue(item)}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </CommandList>
  );
}