import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { TFMethod, QueryConfig } from '@/types/search';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
    config: QueryConfig;
    onConfigChange: (config: QueryConfig) => void;
}

export default function SearchConfig({ config, onConfigChange }: Props) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [customTerms, setCustomTerms] = useState<number>(() => {
        return typeof config.expansion_terms_count === "number" ? config.expansion_terms_count : 3;
    });

    return (
        <div className="space-y-2">
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
                                    onConfigChange({ ...config, is_stemming: checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="stemming">Lakukan Stemming</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="cursor-pointer"
                                id="stopwords"
                                checked={config.is_stop_words_removal}
                                onCheckedChange={(checked) => 
                                    onConfigChange({ ...config, is_stop_words_removal: checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="stopwords">Eliminasi Stop Words</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="cursor-pointer"
                                id="idf"
                                checked={config.idf}
                                onCheckedChange={(checked) => 
                                    onConfigChange({ ...config, idf: checked as boolean })}
                            />
                            <label className="text-sm" htmlFor="idf">Kalkulasi IDF</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                className="cursor-pointer"
                                id="normalization"
                                checked={config.normalization}
                                onCheckedChange={(checked) => 
                                    onConfigChange({ ...config, normalization: checked as boolean })}
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
                                    onConfigChange({ ...config, term_frequency_method: value })}
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
                                            onConfigChange({ ...config, expansion_terms_count: "all" });
                                        } else {
                                            onConfigChange({ ...config, expansion_terms_count: customTerms });
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
                                            onConfigChange({ ...config, expansion_terms_count: value });
                                        }}
                                        className="w-24"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 