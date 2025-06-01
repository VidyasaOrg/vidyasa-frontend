import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/layouts/ContentLayout";
import { SearchIcon } from "lucide-react";

interface TermLocations {
    [term: string]: number[];
}

function InverseDocIdPage() {
    const [docId, setDocId] = useState("");
    const [terms, setTerms] = useState<TermLocations | null>(null);

    const handleSearch = () => {
        // TODO: Implement API call
        // For now, just show dummy data
        setTerms({
            "hello": [1, 4, 7],
            "world": [2, 8],
            "example": [3, 5, 6, 9]
        });
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
                        />
                        <Button 
                            onClick={handleSearch}
                            disabled={!docId.trim()}
                            className="hover:cursor-pointer flex items-center gap-2"
                        >
                            Cari <SearchIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                {terms && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Hasil Pencarian</h2>
                        {Object.keys(terms).length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {Object.entries(terms).map(([term, locations]) => (
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
                        ) : (
                            <p className="text-muted-foreground">Dokumen tidak ditemukan</p>
                        )}
                    </div>
                )}
            </div>
        </ContentLayout>
    );
}

export default InverseDocIdPage; 