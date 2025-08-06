'use client';

import { useState, useEffect } from 'react';
import useItemSearch from '../hooks/useItemSearch';

interface Props {
  onItemSelected: (itemId: string) => void;
}

export default function SearchBar({ onItemSelected }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{
    uniqueName?: string;
    LocalizedNames?: { 'PT-BR'?: string };
    LocalizationNameVariable?: string;
  }[]>([]);
  const { search } = useItemSearch();

  useEffect(() => {
    if (query) {
      setSuggestions(search(query));
    } else {
      setSuggestions([]);
    }
  }, [query, search]);

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const getUniqueName = (
    item: { uniqueName?: string; LocalizationNameVariable?: string }
  ): string | undefined => {
    if (item.uniqueName) {
      return item.uniqueName;
    }
    if (item.LocalizationNameVariable) {
      return item.LocalizationNameVariable.replace('@ITEMS_', '');
    }
    return undefined;
  };

  const handleSelect = (
    item: {
      uniqueName?: string;
      LocalizedNames?: { 'PT-BR'?: string };
      LocalizationNameVariable?: string;
    }
  ) => {
    const uniqueName = getUniqueName(item);

    setQuery(item.LocalizedNames?.['PT-BR'] ?? uniqueName ?? '');
    setSuggestions([]);

    if (uniqueName) {
      onItemSelected(uniqueName);
    } else {
      console.error('UniqueName is missing for the selected item.');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Digite o nome do item"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   transition duration-150 ease-in-out"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out text-gray-800"
            >
              {item.LocalizedNames?.['PT-BR'] ?? getUniqueName(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
