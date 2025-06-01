import { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { MultiQueryRequest, TFMethod, AdditionalTerms, QueryConfig } from '@/types/search';
import { ChevronDownIcon, ChevronUpIcon, UploadIcon } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { cn } from "@/lib/utils";

interface BatchUploadProps {
    onUpload: (request: MultiQueryRequest) => void;
    defaultConfig?: QueryConfig;
}

export default function BatchUpload({ onUpload, defaultConfig }: BatchUploadProps) {
    const { setSearchConfig } = useSearch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [config, setConfig] = useState<QueryConfig>(defaultConfig || {
        is_stemming: true,
        expansion_terms_count: 3,
        is_stop_words_removal: true,
        term_frequency_method: "raw",
        idf: true,
        normalization: true
    });

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [customTerms, setCustomTerms] = useState<number>(() => {
        if (defaultConfig && typeof defaultConfig.expansion_terms_count === "number") {
            return defaultConfig.expansion_terms_count;
        }
        return 3;
    });

    // Helper function to update both local state and context
    const updateConfig = (newConfig: QueryConfig) => {
        setConfig(newConfig);
        setSearchConfig(newConfig);
    };

    const validateAndSetFile = (file: File) => {
        if (file.type === "application/json") {
            setSelectedFile(file);
            return true;
        } else {
            setSelectedFile(null);
            alert("Please select a JSON file");
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
                            {selectedFile ? selectedFile.name : "Upload file JSON"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Klik untuk memilih file atau drag and drop
                        </p>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".json,application/json"
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

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="cursor-pointer"
                >
                    Pengaturan Lanjut {showAdvanced ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </Button>
            </div>

            {showAdvanced && (
                <div className="space-y-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="cursor-pointer"
                                id="stemming"
                                checked={config.is_stemming}
                                onCheckedChange={(checked) => 
                                    updateConfig({ ...config, is_stemming: checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="stemming">Lakukan Stemming</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="cursor-pointer"
                                id="stopwords"
                                checked={config.is_stop_words_removal}
                                onCheckedChange={(checked) => 
                                    updateConfig({ ...config, is_stop_words_removal: checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="stopwords">Eliminasi Stop Words</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="cursor-pointer"
                                id="idf"
                                checked={config.idf}
                                onCheckedChange={(checked) => 
                                    updateConfig({ ...config, idf: checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="idf">Kalkulasi IDF</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="cursor-pointer"
                                id="normalization"
                                checked={config.normalization}
                                onCheckedChange={(checked) => 
                                    updateConfig({ ...config, normalization: checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="normalization">Lakukan Normalisasi</label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="tf" className="text-sm">Metode TF</label>
                            <Select
                                value={config.term_frequency_method}
                                onValueChange={(value: TFMethod) => 
                                    updateConfig({ ...config, term_frequency_method: value })}
                            >
                                <SelectTrigger className='cursor-pointer'>
                                    <SelectValue placeholder="Pilih metode TF" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="raw">Raw</SelectItem>
                                    <SelectItem value="log">Logarithmic</SelectItem>
                                    <SelectItem value="binary">Binary</SelectItem>
                                    <SelectItem value="augmented">Augmented</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="additional-terms" className="text-sm">Term Tambahan</label>
                            <div className="flex gap-2">
                                <Select
                                    value={config.expansion_terms_count === "all" ? "all" : "custom"}
                                    onValueChange={(value) => {
                                        if (value === "all") {
                                            updateConfig({ ...config, expansion_terms_count: "all" });
                                        } else {
                                            updateConfig({ ...config, expansion_terms_count: customTerms });
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jumlah term" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Term</SelectItem>
                                        <SelectItem value="custom">Kustom</SelectItem>
                                    </SelectContent>
                                </Select>
                                {config.expansion_terms_count !== "all" && (
                                    <Input
                                        type="number"
                                        min={1}
                                        value={customTerms}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            setCustomTerms(value);
                                            updateConfig({ ...config, expansion_terms_count: value });
                                        }}
                                        className="w-24"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
} 