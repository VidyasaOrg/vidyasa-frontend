import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { SingleQueryRequest, TFMethod, QueryConfig } from '@/types/search';
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from 'lucide-react';
import { z } from 'zod';
import { useSearch } from '@/contexts/SearchContext';

const querySchema = z.string().min(1);

interface SearchConfigProps {
    onSearch: (request: SingleQueryRequest) => void;
    defaultQuery?: string;
    defaultConfig?: QueryConfig;
}

export default function SearchConfig({ onSearch, defaultQuery = '', defaultConfig }: SearchConfigProps) {
    const { setSearchConfig } = useSearch();
    const [query, setQuery] = useState(defaultQuery);
    const [config, setConfig] = useState<QueryConfig>(defaultConfig || {
        is_stemming: true,
        expansion_terms_count: "all",
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
        return 5;
    });

    // Helper function to update both local state and context
    const updateConfig = (newConfig: QueryConfig) => {
        setConfig(newConfig);
        setSearchConfig(newConfig);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = querySchema.safeParse(query.trim());
        if (!result.success) {
            return;
        }
        const request: SingleQueryRequest = {
            query: query.trim(),
            config: config
        };
        onSearch(request);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-2">
            <div className="flex gap-2">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Masukkan kata kunci pencarian"
                    className="flex-1"
                />
                <Button 
                    type="submit" 
                    disabled={!querySchema.safeParse(query.trim()).success}
                >
                    Cari <SearchIcon className="w-4 h-4" />
                </Button>
            </div>

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