import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ContentLayout from "@/layouts/ContentLayout";
import { SearchIcon } from "lucide-react";

function InverseDocTermPage() {
    const [term, setTerm] = useState("");
    const [documents, setDocuments] = useState<number[] | null>(null);

    const handleSearch = () => {
        // TODO: Implement API call
        // For now, just show dummy data
        setDocuments([1, 3, 5, 7]);
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
                            onChange={(e) => setTerm(e.target.value)}
                            placeholder="Masukkan term yang ingin dicari"
                            className="flex-1"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && term.trim()) {
                                    handleSearch();
                                }
                            }}
                        />
                        <Button 
                            onClick={handleSearch}
                            disabled={!term.trim()}
                            className="hover:cursor-pointer flex items-center gap-2"
                        >
                            Cari <SearchIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                {documents && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Hasil Pencarian</h2>
                        {documents.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {documents.map((docId) => (
                                    <div 
                                        key={docId}
                                        className="px-3 py-1 bg-primary/10 rounded-md text-sm"
                                    >
                                        Document {docId}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Tidak ada dokumen yang mengandung term tersebut</p>
                        )}
                    </div>
                )}
            </div>
        </ContentLayout>
    );
}

export default InverseDocTermPage; 