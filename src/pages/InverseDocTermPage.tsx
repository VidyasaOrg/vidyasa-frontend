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

interface SearchState {
    status: 'idle' | 'loading' | 'success' | 'error';
    data: number[] | null;
    error: string | null;
}

function InverseDocTermPage() {
    const [term, setTerm] = useState("");
    const [searchState, setSearchState] = useState<SearchState>({
        status: 'idle',
        data: null,
        error: null
    });

    const simulateApiCall = async (term: string): Promise<{ status: number; data?: number[] }> => {
        const delay = Math.random() * 5000 + 500;
        await new Promise(resolve => setTimeout(resolve, delay));

        if (Math.random() < 0.1) {
            return { status: 500 };
        }

        if (Math.random() < 0.3) {
            return { status: 404 };
        }

        const numDocs = Math.floor(Math.random() * 10) + 1;
        const docs = Array.from({ length: numDocs }, () => Math.floor(Math.random() * 100) + 1)
            .sort((a, b) => a - b);

        return { status: 200, data: docs };
    };

    const handleSearch = async () => {
        setSearchState({ status: 'loading', data: null, error: null });

        try {
            const response = await simulateApiCall(term);

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
                        error: `Term "${term}" tidak ditemukan dalam dokumen manapun`
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

    return (
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-24">
                <h1 className="text-5xl font-bold text-center">Inverse Document Term</h1>
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold">Masukkan Term</h2>
                    <div className="flex gap-4">
                        <Input
                            value={term}
                            onChange={(e) => {
                                // Only allow single word input (no spaces)
                                const newValue = e.target.value.trim();
                                if (!newValue.includes(' ')) {
                                    setTerm(newValue);
                                }
                            }}
                            placeholder="Masukkan satu kata untuk dicari"
                            className="flex-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && term.trim() && !term.includes(' ')) {
                                    handleSearch();
                                }
                            }}
                            disabled={searchState.status === 'loading'}
                        />
                        <Button 
                            onClick={handleSearch}
                            disabled={!term.trim() || term.includes(' ') || searchState.status === 'loading'}
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
                            Mencari dokumen yang relevan...
                        </div>
                    )}
                    {(searchState.status === 'success' || searchState.status === 'error') && (
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-xl font-bold">Hasil Pencarian</h2>
                            {searchState.status === 'success' && searchState.data && (
                                <div className="flex flex-wrap gap-2">
                                    {searchState.data.map((docId) => (
                                        <div 
                                            key={docId}
                                            className="px-3 py-1 bg-primary/10 rounded-md text-sm"
                                        >
                                            Document {docId}
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

export default InverseDocTermPage; 