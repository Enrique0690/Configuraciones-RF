import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfigItem {
  label: string;
  route?: string;
  id?: string;
  category?: string;
}

interface GroupedResults {
  [category: string]: { label: string; route?: string; id?: string }[];
}

const normalizeText = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const useSearch = (configs: ConfigItem[]) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>('');

  const filteredResults = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    const filtered = configs.filter((item) => {
      const translatedLabel = t(item.label); // Traduce el label
      const translatedCategory = t(item.category || 'default'); 
      return (
        normalizeText(translatedLabel).includes(normalizedQuery) ||
        normalizeText(translatedCategory).includes(normalizedQuery)
      );
    });

    // Agrupar resultados por categoría traducida
    return filtered.reduce<GroupedResults>((acc, item) => {
      const category = t(item.category || 'default'); 
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        ...item,
        label: t(item.label),
      });
      return acc;
    }, {});
  }, [query, configs, t]);

  return {
    query,
    setQuery,
    filteredResults,
  };
};

export default useSearch;