import { useSearchParams, Navigate, Link } from 'react-router';
import { useEffect, useState } from 'react';
import ContentLayout from '@/layouts/ContentLayout';
import QueryWeights from '@/components/QueryWeights';
import RankedDocuments from '@/components/RankedDocuments';
import type { SingleQueryRequest, SingleQueryResponse, QueryConfig } from '@/types/search';
import { useSearch } from '@/contexts/SearchContext';
import InteractiveSearch from '@/components/InteractiveSearch';
import { singleSearch } from '@/lib/api';

function SearchResultsPage() {
    const [params] = useSearchParams();
    const query = params.get('query') ?? '';
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SingleQueryResponse | null>(null);
    const { searchConfig } = useSearch();

    const handleSearch = async (request: SingleQueryRequest) => {
        setLoading(true);
        try {
            const response = await singleSearch(request);
            setResults(response);
        } catch (error) {
            console.error('Search failed:', error);
            // Handle error state
        } finally {
            setLoading(false);
        }
    };

    // Only perform initial search when the page loads
    useEffect(() => {
        if (!query) return;
        
        // Use the stored config if available, otherwise use defaults
        const initialConfig: QueryConfig = searchConfig || {
            is_stemming: true,
            expansion_terms_count: "all",
            is_stop_words_removal: true,
            term_frequency_method: "raw",
            idf: true,
            normalization: true
        };
        
        handleSearch({
            query,
            config: initialConfig
        });
    }, [query]);

    if (!query) return <Navigate to="/" />;

    return (
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-12">
                <Link to="/">
                    <h1 className="text-5xl font-bold text-center">Mesin Pencari</h1>
                </Link>

                <div className="w-full space-y-8">
                    <InteractiveSearch 
                        defaultQuery={query}
                        defaultConfig={searchConfig || undefined}
                        onSearch={handleSearch}
                    />

                    {loading && (
                        <div className="text-lg text-muted-foreground text-center" 
                             style={{ animation: 'flicker 2s ease-in-out infinite' }}>
                            Mencari dokumen yang relevan...
                        </div>
                    )}

                    {results && !loading && (
                        <div className="space-y-8">
                            <div className="p-4 border rounded-lg space-y-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Query Awal</div>
                                        <div className="font-medium">{results.original_query}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Query Ekspansi</div>
                                        <div className="font-medium">{results.expanded_query}</div>
                                    </div>
                                </div>
                            </div>

                            <RankedDocuments 
                                originalRanking={results.original_ranking}
                                expandedRanking={results.expanded_ranking}
                                originalMapScore={results.original_map_score}
                                expandedMapScore={results.expanded_map_score}
                            />

                            <QueryWeights 
                                originalWeights={results.original_query_weights}
                                expandedWeights={results.expanded_query_weights}
                            />
                        </div>
                    )}
                </div>
            </div>
        </ContentLayout>
    );
}

export default SearchResultsPage;
