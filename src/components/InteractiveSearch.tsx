import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SingleQueryRequest, QueryDocumentConfig } from '@/types/search';
import { SearchIcon } from 'lucide-react';
import { z } from 'zod';
import { useSearch } from '@/contexts/SearchContext';
import SearchConfig from './SearchConfig';

const querySchema = z.string().min(1);

interface InteractiveSearchProps {
    onSearch: (request: SingleQueryRequest) => void;
    defaultQuery?: string;
    defaultConfig?: QueryDocumentConfig;
}

export default function InteractiveSearch({ onSearch, defaultQuery = '', defaultConfig }: InteractiveSearchProps) {
    const { setSearchConfig } = useSearch();
    const [query, setQuery] = useState(defaultQuery);
    const [config, setConfig] = useState<QueryDocumentConfig>(defaultConfig || {
        is_stemming: false,
        expansion_terms_count: "all",
        is_stop_words_removal: true,
        query_term_frequency_method: "raw",
        query_term_weighting_method: "tf_idf",
        document_term_frequency_method: "raw",
        document_term_weighting_method: "tf_idf",
        cosine_normalization_query: false,
        cosine_normalization_document: false,
        query_expansion_type: "no_prompt"
    });

    const updateConfig = (newConfig: QueryDocumentConfig) => {
        setConfig(newConfig);
        setSearchConfig(newConfig);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = querySchema.safeParse(query.trim());
        if (!result.success) {
            return;
        }
        const request = {
            query: query.trim(),
            ...config,
            is_queries_from_cisi: false
        };
        console.log("Sending to backend:", request);
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