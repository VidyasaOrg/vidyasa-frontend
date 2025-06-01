import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/layouts/ContentLayout";
import { SearchIcon } from "lucide-react";
import { docIdSearch } from "@/lib/api";
import type { SearchState, TermLocations } from "@/types/search";

function InverseDocIdPage() {
    const [docId, setDocId] = useState("");
    const [searchState, setSearchState] = useState<SearchState<TermLocations>>({
        status: 'idle',
        data: null,
        error: null
    });

    const handleInputChange = (value: string) => {
        // Only allow positive integers
        if (value === "" || /^[1-9][0-9]*$/.test(value)) {
            setDocId(value);
        }
    };

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
                    {searchState.status === 'loading' && (
                        <div className="text-lg text-muted-foreground text-center">
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