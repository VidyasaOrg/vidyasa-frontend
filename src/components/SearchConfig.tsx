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
import type { TFMethod, QueryDocumentConfig, TermWeightingMethod } from '@/types/search';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
    config: QueryDocumentConfig;
    onConfigChange: (config: QueryDocumentConfig) => void;
}

export default function SearchConfig({ config, onConfigChange }: Props) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [customTerms, setCustomTerms] = useState<number>(() => {
        return typeof config.expansion_terms_count === "number" ? config.expansion_terms_count : 1;
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
                    </div>

                    {/* Query Weighting Section */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-base">Query Weighting</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="query-tf" className="text-sm">Metode TF</label>
                                <Select
                                    value={config.query_term_frequency_method}
                                    onValueChange={(value: TFMethod) =>
                                        onConfigChange({ ...config, query_term_frequency_method: value })}
                                >
                                    <SelectTrigger className="cursor-pointer">
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
                                <label htmlFor="query-term-weighting" className="text-sm">Metode Pembobotan</label>
                                <Select
                                    value={config.query_term_weighting_method}
                                    onValueChange={(value: TermWeightingMethod) =>
                                        onConfigChange({ ...config, query_term_weighting_method: value })}
                                >
                                    <SelectTrigger className="cursor-pointer">
                                        <SelectValue placeholder="Pilih metode pembobotan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tf">TF</SelectItem>
                                        <SelectItem value="idf">IDF</SelectItem>
                                        <SelectItem value="tf_idf">TF-IDF</SelectItem>
                                        <SelectItem value="tf_idf_norm">TF-IDF-Norm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2 col-span-2">
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
                                        <SelectTrigger className="cursor-pointer">
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
                            <div className="flex items-center gap-2 col-span-2">
                                <Checkbox
                                    className="cursor-pointer"
                                    id="cosine-query"
                                    checked={config.cosine_similarity_query ?? false}
                                    onCheckedChange={(checked) =>
                                        onConfigChange({ ...config, cosine_similarity_query: checked as boolean })
                                    }
                                />
                                <label className="text-sm" htmlFor="cosine-query">Cosine Similarity</label>
                            </div>
                        </div>
                    </div>

                    {/* Document Weighting Section */}
                    <div className="space-y-2 pt-4 border-t">
                        <h3 className="font-semibold text-base">Document Weighting</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="doc-tf" className="text-sm">Metode TF</label>
                                <Select
                                    value={config.document_term_frequency_method}
                                    onValueChange={(value: TFMethod) =>
                                        onConfigChange({ ...config, document_term_frequency_method: value })}
                                >
                                    <SelectTrigger className="cursor-pointer">
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
                                <label htmlFor="doc-term-weighting" className="text-sm">Metode Pembobotan</label>
                                <Select
                                    value={config.document_term_weighting_method}
                                    onValueChange={(value: TermWeightingMethod) =>
                                        onConfigChange({ ...config, document_term_weighting_method: value })}
                                >
                                    <SelectTrigger className="cursor-pointer">
                                        <SelectValue placeholder="Pilih metode pembobotan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tf">TF</SelectItem>
                                        <SelectItem value="idf">IDF</SelectItem>
                                        <SelectItem value="tf_idf">TF-IDF</SelectItem>
                                        <SelectItem value="tf_idf_norm">TF-IDF-Norm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                                <Checkbox
                                    className="cursor-pointer"
                                    id="cosine-document"
                                    checked={config.cosine_similarity_document ?? false}
                                    onCheckedChange={(checked) =>
                                        onConfigChange({ ...config, cosine_similarity_document: checked as boolean })
                                    }
                                />
                                <label className="text-sm" htmlFor="cosine-document">Cosine Similarity</label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
// ...existing code...