import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/layouts/ContentLayout";
import { SearchIcon } from "lucide-react";
import { termSearch } from "@/lib/api";
import type { SearchState, TermInfo } from "@/types/search";

function InverseDocTermPage() {
    const [term, setTerm] = useState("");
    const [searchState, setSearchState] = useState<SearchState<TermInfo>>({
        status: 'idle',
        data: null,
        error: null
    });

    const handleSearch = async () => {
        setSearchState({ status: 'loading', data: null, error: null });

        try {
            const response = await termSearch(term);

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
            console.error('Search error:', error);
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
                    {searchState.status === 'loading' && (
                        <div className="text-lg text-muted-foreground text-center">
                            Mencari dokumen yang relevan...
                        </div>
                    )}
                    {(searchState.status === 'success' || searchState.status === 'error') && (
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-xl font-bold">Hasil Pencarian</h2>
                            {searchState.status === 'success' && searchState.data && (
                                <div className="flex flex-col gap-6">
                                    <div className="flex gap-4">
                                        <div className="px-4 py-2 bg-primary/10 rounded-md">
                                            <span className="font-semibold">Jumlah Dokumen:</span> {searchState.data.document_frequency}
                                        </div>
                                        <div className="px-4 py-2 bg-primary/10 rounded-md">
                                            <span className="font-semibold">Total Kemunculan:</span> {searchState.data.total_occurrences}
                                        </div>
                                    </div>
                                    <div className="grid gap-4">
                                        {searchState.data.documents.map((doc) => (
                                            <div 
                                                key={doc.doc_id}
                                                className="p-4 bg-card rounded-lg border shadow-sm"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-semibold">Dokumen {doc.doc_id}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Bobot Kata: {doc.weight.toFixed(4)}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                                    {doc.document_preview}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
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