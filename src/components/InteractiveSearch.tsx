import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SingleQueryRequest, QueryConfig } from '@/types/search';
import { SearchIcon } from 'lucide-react';
import { z } from 'zod';
import { useSearch } from '@/contexts/SearchContext';
import SearchConfig from './SearchConfig';

const querySchema = z.string().min(1);

interface InteractiveSearchProps {
    onSearch: (request: SingleQueryRequest) => void;
    defaultQuery?: string;
    defaultConfig?: QueryConfig;
}

export default function InteractiveSearch({ onSearch, defaultQuery = '', defaultConfig }: InteractiveSearchProps) {
    const { setSearchConfig } = useSearch();
    const [query, setQuery] = useState(defaultQuery);
    const [config, setConfig] = useState<QueryConfig>(defaultConfig || {
        is_stemming: false,
        expansion_terms_count: 1,
        is_stop_words_removal: true,
        query_term_frequency_method: "raw",
        query_term_weighting_method: "tf_idf",
        document_term_frequency_method: "raw",
        document_term_weighting_method: "tf_idf",
    });

    const updateConfig = (newConfig: QueryConfig) => {
        setConfig(newConfig);
        setSearchConfig(newConfig);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = querySchema.safeParse(query.trim());
        if (!result.success) {
            return;
        }
        const request: SingleQueryRequest = {
            query: query.trim(),
            config: config
        };
        onSearch(request);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-2">
            <div className="flex gap-2">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Masukkan kata kunci pencarian"
                    className="flex-1"
                />
                <Button 
                    type="submit" 
                    disabled={!querySchema.safeParse(query.trim()).success}
                >
                    Cari <SearchIcon className="w-4 h-4" />
                </Button>
            </div>

            <SearchConfig 
                config={config}
                onConfigChange={updateConfig}
            />
        </form>
    );
} 