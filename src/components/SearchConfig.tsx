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
import type { SingleQueryRequest, TFMethod, AdditionalTerms } from '@/types/search';
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from 'lucide-react';
import { z } from 'zod';

const querySchema = z.string().min(1);

interface SearchConfigProps {
    onSearch: (config: SingleQueryRequest) => void;
    defaultQuery?: string;
}

export default function SearchConfig({ onSearch, defaultQuery = '' }: SearchConfigProps) {
    const [config, setConfig] = useState<SingleQueryRequest>({
        query: defaultQuery,
        stemming: true,
        "additional-term": "all",
        "eliminate-stop-word": true,
        tf: "raw",
        idf: true,
        normalization: true
    });

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [customTerms, setCustomTerms] = useState<number>(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = querySchema.safeParse(config.query.trim());
        if (!result.success) {
            return;
        }
        onSearch({
            ...config,
            query: config.query.trim()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-2">
            <div className="flex gap-2">
                <Input
                    value={config.query}
                    onChange={(e) => setConfig({ ...config, query: e.target.value })}
                    placeholder="Masukkan kata kunci pencarian"
                    className="flex-1"
                />
                <Button 
                    type="submit" 
                    disabled={!querySchema.safeParse(config.query.trim()).success}
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
                                checked={config.stemming}
                                onCheckedChange={(checked) => 
                                    setConfig({ ...config, stemming: checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="stemming">Lakukan Stemming</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="cursor-pointer"
                                id="stopwords"
                                checked={config["eliminate-stop-word"]}
                                onCheckedChange={(checked) => 
                                    setConfig({ ...config, "eliminate-stop-word": checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="stopwords">Eliminasi Stop Words</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="cursor-pointer"
                                id="idf"
                                checked={config.idf}
                                onCheckedChange={(checked) => 
                                    setConfig({ ...config, idf: checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="idf">Kalkulasi IDF</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="cursor-pointer"
                                id="normalization"
                                checked={config.normalization}
                                onCheckedChange={(checked) => 
                                    setConfig({ ...config, normalization: checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="normalization">Lakukan Normalisasi</label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="tf" className="text-sm">Metode TF</label>
                            <Select
                                value={config.tf}
                                onValueChange={(value: TFMethod) => 
                                    setConfig({ ...config, tf: value })}
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
                                    value={config["additional-term"] === "all" ? "all" : "custom"}
                                    onValueChange={(value) => {
                                        if (value === "all") {
                                            setConfig({ ...config, "additional-term": "all" });
                                        } else {
                                            setConfig({ ...config, "additional-term": customTerms });
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
                                {config["additional-term"] !== "all" && (
                                    <Input
                                        type="number"
                                        min={1}
                                        value={customTerms}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            setCustomTerms(value);
                                            setConfig({ ...config, "additional-term": value });
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