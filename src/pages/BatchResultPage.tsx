import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import ContentLayout from '@/layouts/ContentLayout';
import { Button } from '@/components/ui/button';
import { DownloadIcon, AlertCircle } from 'lucide-react';
import type { MultiQueryResponse, APIError } from '@/types/search';

interface BatchResultPageProps {
    response?: MultiQueryResponse;
    error?: APIError;
}

export default function BatchResultPage({ response, error }: BatchResultPageProps) {
    const navigate = useNavigate();

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

    return (
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-12">
                <Link to="/">
                    <h1 className="text-5xl font-bold text-center">Mesin Pencari</h1>
                </Link>

                <div className="w-full max-w-2xl mx-auto space-y-8">
                    {error ? (
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
                                onClick={() => navigate('/')}
                            >
                                Kembali
                            </Button>
                        </div>
                    ) : response ? (
                        <div className="p-6 border rounded-lg space-y-4">
                            <h2 className="text-lg font-semibold">Hasil Pencarian Batch</h2>
                            <p className="text-muted-foreground">
                                File hasil pencarian telah siap. Klik tombol di bawah untuk mengunduh.
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2"
                                >
                                    <DownloadIcon className="w-4 h-4" />
                                    Unduh Hasil
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/')}
                                >
                                    Kembali
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/')}
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