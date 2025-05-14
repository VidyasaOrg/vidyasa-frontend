import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation, useSearchParams } from 'react-router';
import { z } from 'zod';

const querySchema = z.string().min(1, "Query is required");

interface SearchBarProps {
    autoFocus?: boolean;
    redirectToSearch?: boolean;
}

function SearchBar({ autoFocus = false, redirectToSearch = false }: SearchBarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const handleSearch = () => {
        const result = querySchema.safeParse(query.trim());
        if (!result.success) {
            return;
        }

        const encoded = encodeURIComponent(query.trim());

        if (redirectToSearch || location.pathname === '/') {
            navigate(`/search?query=${encoded}`);
        } else {
            navigate(`?query=${encoded}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="flex gap-2">
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cari apa hari ini?"
                autoFocus={autoFocus}
            />
            <Button onClick={handleSearch}>Search</Button>
        </div>
    );
}

export default SearchBar;
