import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/layouts/ContentLayout";
import { SearchIcon } from "lucide-react";
import { docIdSearch } from "@/lib/api";
import type { SearchState, DocumentInfo } from "@/types/search";

function InverseDocIdPage() {
    const [docId, setDocId] = useState("");
    const [searchState, setSearchState] = useState<SearchState<DocumentInfo>>({
        status: 'idle',
        data: null,
        error: null
    });

    const handleSearch = async () => {
        setSearchState({ status: 'loading', data: null, error: null });

        try {
            const response = await docIdSearch(docId);

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
                        error: `Dokumen dengan ID "${docId}" tidak ditemukan`
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
                <h1 className="text-5xl font-bold text-center">Inverse Document ID</h1>
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold">Masukkan Document ID</h2>
                    <div className="flex gap-4">
                        <Input
                            type="number"
                            value={docId}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d+$/.test(value)) {
                                    setDocId(value);
                                }
                            }}
                            placeholder="Masukkan ID dokumen (angka)"
                            className="flex-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && docId.trim()) {
                                    handleSearch();
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
                    {searchState.status === 'loading' && (
                        <div className="text-lg text-muted-foreground text-center">
                            Mencari informasi dokumen...
                        </div>
                    )}
                    {(searchState.status === 'success' || searchState.status === 'error') && (
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-xl font-bold">Hasil Pencarian</h2>
                            {searchState.status === 'success' && searchState.data && (
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="px-4 py-2 bg-primary/10 rounded-md">
                                            <span className="font-semibold">Panjang Dokumen:</span> {searchState.data.length}
                                        </div>
                                        <div className="px-4 py-2 bg-primary/10 rounded-md">
                                            <span className="font-semibold">Term Unik:</span> {searchState.data.unique_terms}
                                        </div>
                                        <div className="px-4 py-2 bg-primary/10 rounded-md">
                                            <span className="font-semibold">Total Term:</span> {searchState.data.total_terms}
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 bg-card rounded-lg border shadow-sm">
                                        <h3 className="font-semibold mb-2">Konten Dokumen:</h3>
                                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                                            {searchState.data.content}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <h3 className="font-semibold">Term dalam Dokumen:</h3>
                                        <div className="grid gap-3">
                                            {Array.isArray(searchState.data.terms) && searchState.data.terms.length > 0 ? (
                                                searchState.data.terms
                                                    .sort((a, b) => b.weight - a.weight)
                                                    .map((term) => (
                                                        <div 
                                                            key={term.term}
                                                            className="p-3 bg-card rounded-lg border shadow-sm flex justify-between items-center"
                                                        >
                                                            <div className="flex flex-col gap-2 flex-1">
                                                                <div className="flex gap-4 items-center">
                                                                    <span className="font-medium">{term.term}</span>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        Frekuensi: {term.raw_tf}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Posisi: {term.positions.join(", ")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                ))
                                            ) : (
                                                <div className="text-muted-foreground text-sm">
                                                    Tidak ada data term untuk dokumen ini.
                                                </div>
                                            )}
                                        </div>
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

export default InverseDocIdPage; 