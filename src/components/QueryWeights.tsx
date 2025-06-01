import type { QueryWeights } from '@/types/search';

interface QueryWeightsProps {
    originalWeights: QueryWeights;
    expandedWeights: QueryWeights;
}

export default function QueryWeights({ originalWeights, expandedWeights }: QueryWeightsProps) {
    // Get all unique terms
    const allTerms = Array.from(new Set([
        ...Object.keys(originalWeights),
        ...Object.keys(expandedWeights)
    ])).sort();

    // Find the maximum weight for scaling the bars
    const maxWeight = Math.max(
        ...Object.values(originalWeights),
        ...Object.values(expandedWeights)
    );

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Perbandingan Bobot Term</h3>
            <div className="space-y-2">
                {allTerms.map(term => (
                    <div key={term} className="space-y-1">
                        <div className="text-sm font-medium">{term}</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">Query Awal</div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-primary/20 rounded-full" 
                                        style={{ 
                                            width: `${((originalWeights[term] || 0) / maxWeight) * 100}%`,
                                            transition: 'width 0.3s ease-in-out'
                                        }} 
                                    />
                                    <span className="text-sm tabular-nums">
                                        {(originalWeights[term] || 0).toFixed(3)}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-muted-foreground">Query Ekspansi</div>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-primary/60 rounded-full" 
                                        style={{ 
                                            width: `${((expandedWeights[term] || 0) / maxWeight) * 100}%`,
                                            transition: 'width 0.3s ease-in-out'
                                        }} 
                                    />
                                    <span className="text-sm tabular-nums">
                                        {(expandedWeights[term] || 0).toFixed(3)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 