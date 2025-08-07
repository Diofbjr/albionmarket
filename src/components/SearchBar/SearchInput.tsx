'use client';

import { useEffect, useState } from 'react';
import { CommandInput } from '@/components/ui/command';

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  onDebouncedQueryChange: (query: string) => void;
}

export default function SearchInput({ query, onQueryChange, onDebouncedQueryChange }: SearchInputProps) {
  useEffect(() => {
    const handler = setTimeout(() => {
      onDebouncedQueryChange(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, onDebouncedQueryChange]);

  return (
    <CommandInput
      placeholder="Digite o nome do item"
      value={query}
      onValueChange={onQueryChange}
      className="h-9"
    />
  );
}