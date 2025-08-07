import { SearchItem } from '../types/types';

/**
 * Extrai o nome único de um item, priorizando 'uniqueName' e
 * depois 'LocalizationNameVariable'.
 */
export const getUniqueName = (item: SearchItem): string | undefined => {
  if (item.uniqueName) {
    return item.uniqueName;
  }
  if (item.LocalizationNameVariable) {
    return item.LocalizationNameVariable.replace('@ITEMS_', '');
  }
  return undefined;
};

/**
 * Extrai o Tier (ex: T4, T8) do nome único de um item.
 */
export const getTier = (uniqueName: string | undefined): string | undefined => {
  if (!uniqueName) {
    return undefined;
  }
  const match = uniqueName.match(/^T\d+/);
  return match ? match[0] : undefined;
};

/**
 * Cria um nome de exibição formatado para o item.
 */
export const getDisplayValue = (item: SearchItem): string => {
  const uniqueName = getUniqueName(item);
  const tier = getTier(uniqueName);
  return `${item.LocalizedNames?.['PT-BR'] ?? uniqueName ?? ''}${tier ? ` (${tier})` : ''}`;
};