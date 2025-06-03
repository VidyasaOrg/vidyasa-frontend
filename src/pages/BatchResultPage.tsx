import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import ContentLayout from '@/layouts/ContentLayout';
import { Button } from '@/components/ui/button';
import { DownloadIcon, AlertCircle } from 'lucide-react';
import { useBatch } from '@/contexts/BatchContext';
import { batchSearch } from '@/lib/api';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import QueryWeights from '@/components/QueryWeights';
import RankedDocuments from '@/components/RankedDocuments';
import type { SingleQueryResponse } from '@/types/search';

export default function BatchResultPage() {
    const navigate = useNavigate();
    const { 
        request, 
        response, 
        error, 
        isProcessing,
        setResponse,
        setError,
        setIsProcessing,
        setRequest 
    } = useBatch();

    const [selectedQueryIndex, setSelectedQueryIndex] = useState<number>(0);

    useEffect(() => {
        if (!request || !isProcessing) return;

        const processRequest = async () => {
            try {
                const result = await batchSearch(request);
                
                switch (result.status) {
                    case 200:
                        setResponse(result.data!);
                        break;
                    case 400:
                        setError({ 
                            status: 400, 
                            message: "Bad Request" 
                        });
                        break;
                    case 500:
                        setError({ 
                            status: 500, 
                            message: "Server Error" 
                        });
                        break;
                    default:
                        setError({ 
                            status: 500, 
                            message: "Unexpected error" 
                        });
                }
            } catch (error) {
                console.error('Error processing request:', error);
                setError({ 
                    status: 500, 
                    message: "Unexpected error" 
                });
            } finally {
                setIsProcessing(false);
            }
        };

        processRequest();
    }, [request, isProcessing]);

    const handleDownload = () => {
        if (!response?.results) return;
        
        // Create a download link for the file
        const blob = new Blob([JSON.stringify(response.results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'search-results.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleBack = () => {
        // Reset state when going back
        setRequest(null);
        setResponse(null);
        setError(null);
        setIsProcessing(false);
        navigate('/');
    };

    const selectedResult: SingleQueryResponse | undefined = 
        response?.results ? response.results[selectedQueryIndex] : undefined;

    return (
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-12">
                <Link to="/">
                    <h1 className="text-5xl font-bold text-center">Mesin Pencari</h1>
                </Link>

                <div className="w-full max-w-4xl mx-auto space-y-8">
                    {isProcessing ? (
                        <div className="text-lg text-muted-foreground text-center" 
                             style={{ animation: 'flicker 2s ease-in-out infinite' }}>
                            Memproses batch query...
                        </div>
                    ) : error ? (
                        <div className="p-6 border rounded-lg space-y-4">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">Error</h2>
                            </div>
                            <p className="text-muted-foreground">
                                {error.status === 400 
                                    ? "Bad Request: Format file tidak sesuai."
                                    : "Terjadi kesalahan pada server. Silakan coba lagi nanti."}
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleBack}
                            >
                                Kembali
                            </Button>
                        </div>
                    ) : response?.results ? (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center gap-4">
                                <Button
                                    onClick={handleDownload}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                    Unduh Hasil
                                </Button>
                                <Select 
                                    value={selectedQueryIndex.toString()}
                                    onValueChange={(value) => setSelectedQueryIndex(parseInt(value))}
                                >
                                    <SelectTrigger className="w-[300px]">
                                        <SelectValue placeholder="Pilih Query" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {response.results.map((result: SingleQueryResponse, index: number) => (
                                            <SelectItem key={index} value={index.toString()}>
                                                {result.original_query}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedResult && (
                                <div className="space-y-8">
                                    <div className="p-4 border rounded-lg space-y-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-muted-foreground">Query Awal</div>
                                                <div className="font-medium">{selectedResult.original_query}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Query Ekspansi</div>
                                                <div className="font-medium">{selectedResult.expanded_query}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <RankedDocuments 
                                        originalRanking={selectedResult.original_ranking}
                                        expandedRanking={selectedResult.expanded_ranking}
                                        originalMapScore={selectedResult.original_map_score}
                                        expandedMapScore={selectedResult.expanded_map_score}
                                    />

                                    <QueryWeights 
                                        originalWeights={selectedResult.original_query_weights}
                                        expandedWeights={selectedResult.expanded_query_weights}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                            >
                                Kembali
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </ContentLayout>
    );
} 