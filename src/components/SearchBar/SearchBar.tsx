'use client';

import { useState, useEffect } from 'react';
import useItemSearch from '../../hooks/useItemSearch';
import { Command } from '@/components/ui/command';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import { SearchItem, SearchBarProps } from '../../types/types';
import { getUniqueName, getDisplayValue } from '../../lib/searchUtils';

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
    <div className="relative w-full max-w-md mx-auto z-50">
      <Command shouldFilter={false} className="rounded-xl border border-border bg-popover shadow-md transition-all">
        <SearchInput
          query={query}
          onQueryChange={setQuery}
          onDebouncedQueryChange={setDebouncedQuery}
        />
        {open && (
          <SearchResults
            suggestions={suggestions}
            query={debouncedQuery}
            onSelect={handleSelect}
          />
        )}
      </Command>
    </div>
  );
}