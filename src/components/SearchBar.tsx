import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router';
import { z } from 'zod';
import { SearchIcon } from 'lucide-react';

const querySchema = z.string().min(1);

interface SearchBarProps {
    autoFocus?: boolean;
}

function SearchBar({ autoFocus = false }: SearchBarProps) {
    const navigate = useNavigate();
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
        navigate(`/search?query=${encoded}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="flex gap-4 w-full">
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Cari apa hari ini?"
                autoFocus={autoFocus}
            />
            <Button onClick={handleSearch} className="flex items-center gap-2 cursor-pointer" disabled={!querySchema.safeParse(query.trim()).success}>
                Cari <SearchIcon />
            </Button>
        </div>
    );
}

export default SearchBar;
