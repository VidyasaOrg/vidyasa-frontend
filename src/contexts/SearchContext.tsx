import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { SingleQueryRequest } from '@/types/search';

interface SearchContextType {
    searchConfig: SingleQueryRequest | null;
    setSearchConfig: (config: SingleQueryRequest) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
    const [searchConfig, setSearchConfig] = useState<SingleQueryRequest | null>(null);

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