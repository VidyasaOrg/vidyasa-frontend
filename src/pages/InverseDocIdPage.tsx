import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/layouts/ContentLayout";
import { SearchIcon } from "lucide-react";

// Add keyframes and animation style at the top
const flickerAnimation = `@keyframes flicker {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
}`;

interface TermLocations {
    [term: string]: number[];
}

interface SearchState {
    status: 'idle' | 'loading' | 'success' | 'error';
    data: TermLocations | null;
    error: string | null;
}

function InverseDocIdPage() {
    const [docId, setDocId] = useState("");
    const [searchState, setSearchState] = useState<SearchState>({
        status: 'idle',
        data: null,
        error: null
    });

    const simulateApiCall = async (docId: string): Promise<{ status: number; data?: TermLocations }> => {
        const delay = Math.random() * 5000 + 500;
        await new Promise(resolve => setTimeout(resolve, delay));

        if (Math.random() < 0.1) {
            return { status: 500 };
        }

        if (Math.random() < 0.3) {
            return { status: 404 };
        }

        // Generate random terms and their positions
        const terms = ["hello", "world", "example", "document", "text", "content"];
        const result: TermLocations = {};
        const numTerms = Math.floor(Math.random() * 4) + 2; // 2-5 terms
        
        for (let i = 0; i < numTerms; i++) {
            const term = terms[Math.floor(Math.random() * terms.length)];
            const numPositions = Math.floor(Math.random() * 5) + 1; // 1-5 positions
            const positions = Array.from({ length: numPositions }, 
                () => Math.floor(Math.random() * 100) + 1)
                .sort((a, b) => a - b);
            result[term] = positions;
        }

        return { status: 200, data: result };
    };

    const handleSearch = async () => {
        setSearchState({ status: 'loading', data: null, error: null });

        try {
            const response = await simulateApiCall(docId);

            switch (response.status) {
                case 200:
                    setSearchState({
                        status: 'success',
                        data: response.data!,
                        error: null
                    });
                    break;
                case 404:
                    setSearchState({
                        status: 'error',
                        data: null,
                        error: `Document dengan ID "${docId}" tidak ditemukan`
                    });
                    break;
                case 500:
                    setSearchState({
                        status: 'error',
                        data: null,
                        error: "Terjadi kesalahan pada server. Silakan coba lagi."
                    });
                    break;
                default:
                    setSearchState({
                        status: 'error',
                        data: null,
                        error: "Terjadi kesalahan yang tidak diketahui"
                    });
            }
        } catch (error) {
            setSearchState({
                status: 'error',
                data: null,
                error: "Terjadi kesalahan saat memproses permintaan"
            });
        }
    };

    const handleInputChange = (value: string) => {
        // Only allow positive integers
        if (value === "" || /^[1-9][0-9]*$/.test(value)) {
            setDocId(value);
        }
    };

    return (
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-24">
                <h1 className="text-5xl font-bold text-center">Inverse Document ID</h1>
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold">Masukkan Document ID</h2>
                    <div className="flex gap-4">
                        <Input
                            value={docId}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="Masukkan ID dokumen"
                            className="flex-1"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && docId.trim()) {
                                    handleSearch();
                                }
                                // Prevent non-numeric input
                                if (
                                    ![8, 9, 13, 27, 46].includes(e.keyCode) && // Allow: backspace, tab, enter, escape, delete
                                    !(e.ctrlKey === true && ['a', 'c', 'v', 'x'].includes(e.key)) && // Allow: Ctrl+A, C, V, X
                                    !/[0-9]/.test(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            disabled={searchState.status === 'loading'}
                        />
                        <Button 
                            onClick={handleSearch}
                            disabled={!docId.trim() || searchState.status === 'loading'}
                            className="hover:cursor-pointer flex items-center gap-2"
                        >
                            Cari <SearchIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center min-h-[60px]">
                    <style>{flickerAnimation}</style>
                    {searchState.status === 'loading' && (
                        <div className="text-lg text-muted-foreground text-center" style={{ animation: 'flicker 2s ease-in-out infinite' }}>
                            Mengindeks term dalam dokumen...
                        </div>
                    )}
                    {(searchState.status === 'success' || searchState.status === 'error') && (
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-xl font-bold">Hasil Pencarian</h2>
                            {searchState.status === 'success' && searchState.data && (
                                <div className="flex flex-col gap-4">
                                    {Object.entries(searchState.data).map(([term, locations]) => (
                                        <div 
                                            key={term}
                                            className="flex flex-col gap-2 p-4 border rounded-lg"
                                        >
                                            <h3 className="font-medium">{term}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {locations.map((location, idx) => (
                                                    <div 
                                                        key={idx}
                                                        className="px-3 py-1 bg-primary/10 rounded-md text-sm"
                                                    >
                                                        Position {location}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {searchState.status === 'error' && (
                                <p className="text-destructive">{searchState.error}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ContentLayout>
    );
}

export default InverseDocIdPage; 