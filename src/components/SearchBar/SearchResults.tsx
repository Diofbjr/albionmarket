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
    <CommandList className="absolute top-full z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
      {suggestions.length === 0 && query.length > 0 ? (
        <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
      ) : (
        <CommandGroup>
          {suggestions.map((item, index) => (
            <CommandItem
              key={index}
              value={getDisplayValue(item)}
              onSelect={() => onSelect(item)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {getDisplayValue(item)}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </CommandList>
  );
}