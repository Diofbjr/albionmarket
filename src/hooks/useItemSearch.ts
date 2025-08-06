import { useEffect, useState, useCallback } from 'react';

interface ItemEntry {
  uniqueName: string;
  LocalizedNames?: {
    'EN-US'?: string;
    'PT-BR'?: string;
  };
}

export default function useItemSearch() {
  const [items, setItems] = useState<ItemEntry[]>([]);

  useEffect(() => {
    console.log('Tentando carregar itens do JSON...');
    fetch('/data/items.json')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        console.log('Itens carregados:', data.length);
      })
      .catch((error) => console.error('Erro ao carregar items.json:', error));
  }, []);

  const search = useCallback((query: string) => {
    console.log('Buscando por:', query);
    if (!query) return [];
    const lowerCaseQuery = query.toLocaleLowerCase();
    const results = items
      .filter((item) => {
        // Verifica se o item é válido E se possui um nome válido para busca
        if (!item) {
          return false;
        }

        const name = item.LocalizedNames?.['PT-BR'] || item.uniqueName;

        // Se o item não tiver nenhum nome, ele não pode ser buscado
        if (!name) {
          return false;
        }
        
        return name.toLocaleLowerCase().includes(lowerCaseQuery);
      })
      .slice(0, 10);
    
    console.log('Resultados da busca:', results.length);
    return results;
  }, [items]);

  return { search };
}