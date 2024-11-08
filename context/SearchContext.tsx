// context/SearchContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definimos el tipo de nuestro contexto
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Inicializamos el contexto
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Creamos un proveedor para envolver la aplicación
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
