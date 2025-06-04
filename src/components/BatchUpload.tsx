import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { MultiQueryRequest, QueryDocumentConfig } from '@/types/search';
import { UploadIcon } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { cn } from "@/lib/utils";
import SearchConfig from './SearchConfig';

interface BatchUploadProps {
    onUpload: (request: MultiQueryRequest) => void;
    defaultConfig?: QueryDocumentConfig;
}

export default function BatchUpload({ onUpload, defaultConfig }: BatchUploadProps) {
    const { setSearchConfig } = useSearch();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [config, setConfig] = useState<QueryDocumentConfig>(defaultConfig || {
        is_stemming: false,
        expansion_terms_count: 1,
        is_stop_words_removal: true,
        query_term_frequency_method: "raw",
        query_term_weighting_method: "tf_idf",
        document_term_frequency_method: "raw",
        document_term_weighting_method: "tf_idf",
        cosine_normalization_query: false,
        cosine_normalization_document: false,
    });

    const updateConfig = (newConfig: QueryDocumentConfig) => {
        setConfig(newConfig);
        setSearchConfig(newConfig);
    };

    const validateAndSetFile = (file: File) => {
        if (file.type === "text/plain" || file.name.endsWith('.txt')) {
            setSelectedFile(file);
            return true;
        } else {
            setSelectedFile(null);
            alert("Please select a text (.txt) file");
            return false;
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
        // Reset input value to allow selecting the same file again
        event.target.value = '';
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        const request: MultiQueryRequest = {
            query: selectedFile,
            config: config
        };
        onUpload(request);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div 
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 transition-colors",
                    isDragging ? "border-primary bg-primary/5" : "hover:border-primary/50"
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-4">
                    <UploadIcon className={cn(
                        "w-8 h-8 transition-colors",
                        isDragging ? "text-primary" : "text-muted-foreground"
                    )} />
                    <div className="flex flex-col items-center gap-1">
                        <Label 
                            htmlFor="file-upload" 
                            className="text-sm font-medium hover:cursor-pointer hover:text-primary/90 transition-colors"
                        >
                            {selectedFile ? selectedFile.name : "Upload file"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Klik untuk memilih file .txt atau drag and drop
                        </p>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".txt,text/plain"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </div>

            <Button 
                type="submit"
                disabled={!selectedFile}
                className="w-full hover:cursor-pointer"
            >
                Proses Batch Query
            </Button>

            <SearchConfig 
                config={config}
                onConfigChange={updateConfig}
            />
        </form>
    );
} 