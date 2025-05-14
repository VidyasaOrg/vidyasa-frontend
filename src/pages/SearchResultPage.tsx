import { useSearchParams, Navigate, Link } from 'react-router';
import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResultCard from '@/components/SearchResultCard';
import { retrieveDocuments } from '@/lib/api';
import ContentLayout from '@/layouts/ContentLayout';

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
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-12">
                <Link to="/">
                    <h1 className="text-5xl font-bold text-center">Mesin Pencari</h1>
                </Link>
                <h2 className="text-lg text-center">Hasil Pencarian untuk: {query}</h2>
                <SearchBar />
                {loading ? (
                    <p className="text-center">Mengambil Dokumen...</p>
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
        </ContentLayout>
    );
}

export default SearchResultsPage;
