'use client';

import { useState, useEffect, useMemo } from 'react';
import useItemSearch from '../hooks/useItemSearch';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

// Tipo de dado para um item de busca
type SearchItem = {
  uniqueName?: string;
  LocalizedNames?: { 'PT-BR'?: string };
  LocalizationNameVariable?: string;
};

interface Props {
  onItemSelected: (itemId: string) => void;
}

export default function SearchBar({ onItemSelected }: Props) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [open, setOpen] = useState(false);
  const { search } = useItemSearch();

  // Função utilitária para extrair o nome único
  const getUniqueName = (item: SearchItem): string | undefined => {
    if (item.uniqueName) {
      return item.uniqueName;
    }
    if (item.LocalizationNameVariable) {
      return item.LocalizationNameVariable.replace('@ITEMS_', '');
    }
    return undefined;
  };

  // Função utilitária para extrair o Tier
  const getTier = (uniqueName: string | undefined): string | undefined => {
    if (!uniqueName) {
      return undefined;
    }
    const match = uniqueName.match(/^T\d+/);
    return match ? match[0] : undefined;
  };

  // Efeito para debounce na query de busca
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Efeito para buscar e processar os resultados
  useEffect(() => {
    if (debouncedQuery) {
      const results = search(debouncedQuery);

      const seen = new Set();
      const uniqueResults = results.filter((item) => {
        const uniqueName = getUniqueName(item);
        const tier = getTier(uniqueName);
        const displayName = `${item.LocalizedNames?.['PT-BR'] ?? uniqueName ?? ''}${tier ? ` (${tier})` : ''}`;
        
        if (seen.has(displayName)) {
          return false;
        }
        seen.add(displayName);
        return true;
      });

      setSuggestions(uniqueResults);
      setOpen(uniqueResults.length > 0);
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }, [debouncedQuery, search]);

  const handleSelect = (item: SearchItem) => {
    const uniqueName = getUniqueName(item);
    const tier = getTier(uniqueName);

    const displayName = `${item.LocalizedNames?.['PT-BR'] ?? uniqueName ?? ''}${tier ? ` (${tier})` : ''}`;

    setQuery(displayName);
    setOpen(false);

    if (uniqueName) {
      onItemSelected(uniqueName);
    } else {
      console.error('UniqueName is missing for the selected item.');
    }
  };

  const getDisplayValue = (item: SearchItem): string => {
    const uniqueName = getUniqueName(item);
    const tier = getTier(uniqueName);
    return `${item.LocalizedNames?.['PT-BR'] ?? uniqueName ?? ''}${tier ? ` (${tier})` : ''}`;
  };

  return (
    <Card className="relative w-full max-w-md mx-auto">
      <CardContent>
        <Command shouldFilter={false} className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Digite o nome do item"
            value={query}
            onValueChange={(value) => setQuery(value)}
            className="h-9"
          />
          {open && (
            <CommandList className="absolute top-full z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {suggestions.length === 0 && query.length > 0 ? (
                <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {suggestions.map((item, index) => (
                    <CommandItem
                      key={index}
                      value={getDisplayValue(item)}
                      onSelect={() => handleSelect(item)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {getDisplayValue(item)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          )}
        </Command>
      </CardContent>
    </Card>
  );
}