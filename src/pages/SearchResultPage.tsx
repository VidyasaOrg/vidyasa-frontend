import { useSearchParams, Navigate, Link } from 'react-router';
import { useEffect, useState } from 'react';
import ContentLayout from '@/layouts/ContentLayout';
import SearchConfig from '@/components/SearchConfig';
import QueryWeights from '@/components/QueryWeights';
import RankedDocuments from '@/components/RankedDocuments';
import type { SingleQueryRequest, SingleQueryResponse, QueryConfig } from '@/types/search';
import { useSearch } from '@/contexts/SearchContext';

function SearchResultsPage() {
    const [params] = useSearchParams();
    const query = params.get('query') ?? '';
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SingleQueryResponse | null>(null);
    const { searchConfig } = useSearch();

    const handleSearch = async (request: SingleQueryRequest) => {
        setLoading(true);
        try {
            // Simulated API call for now
            await new Promise(res => setTimeout(res, Math.random() * 2000 + 1000));
            setResults({
                original_ranking: [
                    { doc_id: 1, similarity_score: 0.85 },
                    { doc_id: 2, similarity_score: 0.75 },
                    { doc_id: 3, similarity_score: 0.65 }
                ],
                expanded_ranking: [
                    { doc_id: 1, similarity_score: 0.90 },
                    { doc_id: 2, similarity_score: 0.80 },
                    { doc_id: 3, similarity_score: 0.70 }
                ],
                original_query: request.query,
                original_map_score: 0.78,
                original_query_weights: {
                    "information": 0.5,
                    "retrieval": 0.5
                },
                expanded_query: request.query + " systems",
                expanded_map_score: 0.82,
                expanded_query_weights: {
                    "information": 0.4,
                    "retrieval": 0.4,
                    "systems": 0.2
                }
            });
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
    }, [query]); // Only depend on query, not searchConfig

    if (!query) return <Navigate to="/" />;

    return (
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-12">
                <Link to="/">
                    <h1 className="text-5xl font-bold text-center">Mesin Pencari</h1>
                </Link>

                <div className="w-full space-y-8">
                    <SearchConfig 
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

                            <QueryWeights 
                                originalWeights={results.original_query_weights}
                                expandedWeights={results.expanded_query_weights}
                            />

                            <RankedDocuments 
                                originalRanking={results.original_ranking}
                                expandedRanking={results.expanded_ranking}
                                originalMapScore={results.original_map_score}
                                expandedMapScore={results.expanded_map_score}
                            />
                        </div>
                    )}
                </div>
            </div>
        </ContentLayout>
    );
}

export default SearchResultsPage;
