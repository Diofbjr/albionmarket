'use client';

import { useState, useEffect } from 'react';
import useItemSearch from '../../hooks/useItemSearch';
import { Command } from '@/components/ui/command';
import { Card, CardContent } from '@/components/ui/card';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import { SearchItem, SearchBarProps } from '../../types/types';
import { getUniqueName, getTier, getDisplayValue } from '../../lib/searchUtils';

export default function SearchBar({ onItemSelected }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [open, setOpen] = useState(false);
  const { search } = useItemSearch();

  useEffect(() => {
    if (debouncedQuery) {
      const results = search(debouncedQuery);
      const seen = new Set();
      const uniqueResults = results.filter((item) => {
        const displayName = getDisplayValue(item);
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
    if (uniqueName) {
      onItemSelected(uniqueName);
      setQuery(getDisplayValue(item));
      setOpen(false);
    } else {
      console.error('UniqueName is missing for the selected item.');
    }
  };

  return (
    <Card className="relative w-full max-w-md mx-auto">
      <CardContent>
        <Command shouldFilter={false} className="rounded-lg border shadow-md">
          <SearchInput
            query={query}
            onQueryChange={setQuery}
            onDebouncedQueryChange={setDebouncedQuery}
          />
          {open && (
            <SearchResults
              suggestions={suggestions}
              query={query}
              onSelect={handleSelect}
            />
          )}
        </Command>
      </CardContent>
    </Card>
  );
}