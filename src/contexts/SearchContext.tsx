import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { QueryDocumentConfig } from '@/types/search';

interface SearchContextType {
    searchConfig: QueryDocumentConfig | null;
    setSearchConfig: (config: QueryDocumentConfig) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
    const [searchConfig, setSearchConfig] = useState<QueryDocumentConfig | null>(null);

    return (
        <SearchContext.Provider value={{ searchConfig, setSearchConfig }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
} 