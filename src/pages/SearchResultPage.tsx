import { useSearchParams, Navigate } from 'react-router';
import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResultCard from '@/components/SearchResultCard';
import { retrieveDocuments } from '@/lib/api';

interface Document {
    id: number;
    title: string;
    snippet: string;
}

function SearchResultsPage() {
    const [params] = useSearchParams();
    const query = params.get('query') ?? '';
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Document[]>([]);

    useEffect(() => {
        if (!query) return;

        setLoading(true);
        retrieveDocuments(query).then((res) => {
            setResults(res);
            setLoading(false);
        });
    }, [query]);

    if (!query) return <Navigate to="/" />;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <SearchBar />
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : results.length === 0 ? (
                <p className="text-center">No results found.</p>
            ) : (
                <ul className="space-y-4">
                    {results.map((doc) => (
                        <SearchResultCard key={doc.id} doc={doc} />
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchResultsPage;
