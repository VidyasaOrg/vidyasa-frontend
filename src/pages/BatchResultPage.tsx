import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import ContentLayout from '@/layouts/ContentLayout';
import { Button } from '@/components/ui/button';
import { DownloadIcon, AlertCircle } from 'lucide-react';
import { useBatch } from '@/contexts/BatchContext';

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

    useEffect(() => {
        if (!request || !isProcessing) return;

        const processRequest = async () => {
            try {
                // Simulate API call
                await new Promise(res => setTimeout(res, 2000));

                // Randomly simulate different scenarios
                const random = Math.random();
                
                if (random < 0.2) {
                    // 20% chance of 400 error
                    setError({ 
                        status: 400, 
                        message: "Bad Request" 
                    });
                } else if (random < 0.3) {
                    // 10% chance of 500 error
                    setError({ 
                        status: 500, 
                        message: "Server Error" 
                    });
                } else {
                    // 70% chance of success - return the same file back
                    setResponse({ 
                        result: request.query 
                    });
                }
            } catch (error) {
                // Handle unexpected errors
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
        if (!response?.result) return;
        
        // Create a download link for the file
        const url = URL.createObjectURL(response.result);
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

    return (
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-12">
                <Link to="/">
                    <h1 className="text-5xl font-bold text-center">Mesin Pencari</h1>
                </Link>

                <div className="w-full max-w-2xl mx-auto space-y-8">
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
                    ) : response ? (
                        <div className="p-6 border rounded-lg space-y-4">
                            <Button
                                onClick={handleDownload}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <DownloadIcon className="w-4 h-4" />
                                Unduh Hasil
                            </Button>
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