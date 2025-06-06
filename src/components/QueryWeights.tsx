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

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Perbandingan Bobot Term</h3>
            <div className="border rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Term</th>
                            <th className="text-right p-3">Bobot Awal</th>
                            <th className="text-right p-3">Bobot Ekspansi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTerms.map((term, index) => (
                            <tr key={term} className={index !== allTerms.length - 1 ? "border-b" : ""}>
                                <td className="p-3 font-medium">{term}</td>
                                <td className="p-3 text-right tabular-nums">
                                    {(originalWeights[term] || 0).toFixed(3)}
                                </td>
                                <td className="p-3 text-right tabular-nums">
                                    {(expandedWeights[term] || 0).toFixed(3)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 