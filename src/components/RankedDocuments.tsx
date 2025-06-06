import type { RankedDocument } from '@/types/search';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface RankedDocumentsProps {
    originalRanking: RankedDocument[];
    expandedRanking: RankedDocument[];
    originalMapScore?: number;
    expandedMapScore?: number;
    scoreLabel?: string;
}

function DocumentList({ documents }: { documents: RankedDocument[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const documentsPerPage = 10;
    
    if (documents.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                Tidak ada dokumen relevan yang ditemukan
            </div>
        );
    }
    
    const maxScore = Math.max(...documents.map(doc => doc.similarity_score));
    
    // Calculate pagination
    const totalPages = Math.ceil(documents.length / documentsPerPage);
    const startIndex = (currentPage - 1) * documentsPerPage;
    const endIndex = startIndex + documentsPerPage;
    const currentDocuments = documents.slice(startIndex, endIndex);

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {currentDocuments.map((doc) => (
                    <div key={doc.doc_id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <h4 className="font-medium">Dokumen {doc.doc_id}</h4>
                                {doc.doc_title && (
                                    <p className="text-sm text-muted-foreground">{doc.doc_title}</p>
                                )}
                            </div>
                            <span className="text-sm tabular-nums">
                                Skor: {doc.similarity_score.toFixed(3)}
                            </span>
                        </div>
                        <div className="h-2 bg-primary/10 rounded-full">
                            <div 
                                className="h-full bg-primary rounded-full"
                                style={{ 
                                    width: `${(doc.similarity_score / maxScore) * 100}%`,
                                    transition: 'width 0.3s ease-in-out'
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {totalPages > 1 && (
                <div className="flex justify-between items-center pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                        Sebelumnya
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} dari {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Selanjutnya
                        <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function RankedDocuments({ 
    originalRanking,
    expandedRanking,
    originalMapScore,
    expandedMapScore,
    scoreLabel = "MAP"
}: RankedDocumentsProps) {

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Peringkat Dokumen</h3>
                {originalMapScore && expandedMapScore && (
                    <div className="flex gap-8">
                        <div className="text-sm">
                            {scoreLabel} Awal: <span className="font-medium">{originalMapScore.toFixed(3)}</span>
                        </div>
                        <div className="text-sm">
                            {scoreLabel} Ekspansi: <span className="font-medium">{expandedMapScore.toFixed(3)}</span>
                        </div>
                    </div>
                )}
            </div>

            <Tabs defaultValue="original">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="original">Peringkat Awal</TabsTrigger>
                    <TabsTrigger value="expanded">Peringkat Ekspansi</TabsTrigger>
                </TabsList>
                <TabsContent value="original" className="mt-4">
                    <DocumentList documents={originalRanking} />
                </TabsContent>
                <TabsContent value="expanded" className="mt-4">
                    <DocumentList documents={expandedRanking} />
                </TabsContent>
            </Tabs>
        </div>
    );
} 