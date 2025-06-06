import { Navigate, Link, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import ContentLayout from '@/layouts/ContentLayout';
import QueryWeights from '@/components/QueryWeights';
import RankedDocuments from '@/components/RankedDocuments';
import type { SingleQueryRequest, SingleQueryResponse } from '@/types/search';
import { useSearch } from '@/contexts/SearchContext';
import InteractiveSearch from '@/components/InteractiveSearch';
import { singleSearch } from '@/lib/api';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SearchResultsPage() {
    const location = useLocation();
    const { searchConfig } = useSearch();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SingleQueryResponse | null>(null);
    const [error, setError] = useState<{ status: number; message: string } | null>(null);
    const [currentRequest, setCurrentRequest] = useState<SingleQueryRequest | null>(
        location.state?.request || null
    );

    const handleSearch = async (request: SingleQueryRequest) => {
        setLoading(true);
        setError(null);
        setCurrentRequest(request);
        try {
            console.log('Starting search with request:', request);
            const response = await singleSearch(request);
            console.log('Search completed, setting results');
            setResults(response);
        } catch (error) {
            console.error('Search failed:', error);
            setError({
                status: 500,
                message: "Terjadi kesalahan pada server. Silakan coba lagi nanti."
            });
        } finally {
            setLoading(false);
        }
    };

    // Only perform initial search once when component mounts
    useEffect(() => {
        let isSubscribed = true;

        const performInitialSearch = async () => {
            if (currentRequest && !results && !loading) {
                console.log('Performing initial search');
                try {
                    setLoading(true);
                    const response = await singleSearch(currentRequest);
                    if (isSubscribed) {
                        console.log('Setting initial results');
                        setResults(response);
                    }
                } catch (error) {
                    console.error('Initial search failed:', error);
                    if (isSubscribed) {
                        setError({
                            status: 500,
                            message: "Terjadi kesalahan pada server. Silakan coba lagi nanti."
                        });
                    }
                } finally {
                    if (isSubscribed) {
                        setLoading(false);
                    }
                }
            }
        };

        performInitialSearch();

        return () => {
            isSubscribed = false;
        };
    }, []); // Empty dependency array since we only want this to run once on mount

    if (!currentRequest) return <Navigate to="/" />;

    return (
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-12">
                <Link to="/">
                    <h1 className="text-5xl font-bold text-center">Mesin Pencari</h1>
                </Link>

                <div className="w-full space-y-8">
                    <InteractiveSearch 
                        defaultQuery={currentRequest.query}
                        defaultConfig={searchConfig || undefined}
                        onSearch={handleSearch}
                    />

                    {loading && (
                        <div className="text-lg text-muted-foreground text-center" 
                             style={{ animation: 'flicker 2s ease-in-out infinite' }}>
                            Mencari dokumen yang relevan...
                        </div>
                    )}

                    {error && (
                        <div className="p-6 border rounded-lg space-y-4">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">Error</h2>
                            </div>
                            <p className="text-muted-foreground">{error.message}</p>
                            <Button
                                variant="outline"
                                onClick={() => setError(null)}
                            >
                                Coba Lagi
                            </Button>
                        </div>
                    )}

                    {results && !loading && !error && (
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
                                scoreLabel="Average Precision"
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
