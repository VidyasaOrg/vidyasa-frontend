import type { RankedDocument } from '@/types/search';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

interface RankedDocumentsProps {
    originalRanking: RankedDocument[];
    expandedRanking: RankedDocument[];
    originalMapScore: number;
    expandedMapScore: number;
}

function DocumentList({ documents }: { documents: RankedDocument[] }) {
    // Find max similarity score for relative bar widths
    const maxScore = Math.max(...documents.map(doc => doc.similarity_score));

    return (
        <div className="space-y-4">
            {documents.map((doc) => (
                <div key={doc.doc_id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium">Dokumen {doc.doc_id}</h4>
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
    );
}

export default function RankedDocuments({ 
    originalRanking,
    expandedRanking,
    originalMapScore,
    expandedMapScore
}: RankedDocumentsProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Peringkat Dokumen</h3>
                <div className="flex gap-8">
                    <div className="text-sm">
                        MAP Awal: <span className="font-medium">{originalMapScore.toFixed(3)}</span>
                    </div>
                    <div className="text-sm">
                        MAP Ekspansi: <span className="font-medium">{expandedMapScore.toFixed(3)}</span>
                    </div>
                </div>
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