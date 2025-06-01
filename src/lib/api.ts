import type { TermLocations } from "@/types/search";

export const termSearch = async (term: string): Promise<{ status: number; data?: number[] }> => {
    const delay = Math.random() * 5000 + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    if (Math.random() < 0.1) {
        return { status: 500 };
    }

    if (Math.random() < 0.3) {
        return { status: 404 };
    }

    const numDocs = Math.floor(Math.random() * 10) + 1;
    const docs = Array.from({ length: numDocs }, () => Math.floor(Math.random() * 100) + 1)
        .sort((a, b) => a - b);

    return { status: 200, data: docs };
};

export const docIdSearch = async (docId: string): Promise<{ status: number; data?: TermLocations }> => {
    const delay = Math.random() * 5000 + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    if (Math.random() < 0.1) {
        return { status: 500 };
    }

    if (Math.random() < 0.3) {
        return { status: 404 };
    }

    // Generate random terms and their positions
    const terms = ["hello", "world", "example", "document", "text", "content"];
    const result: TermLocations = {};
    const numTerms = Math.floor(Math.random() * 4) + 2; // 2-5 terms
    
    for (let i = 0; i < numTerms; i++) {
        const term = terms[Math.floor(Math.random() * terms.length)];
        const numPositions = Math.floor(Math.random() * 5) + 1; // 1-5 positions
        const positions = Array.from({ length: numPositions }, 
            () => Math.floor(Math.random() * 100) + 1)
            .sort((a, b) => a - b);
        result[term] = positions;
    }

    return { status: 200, data: result };
};

export async function retrieveDocuments(query: string) {
  await new Promise((res) => setTimeout(res, Math.random() * 1000 + 250));
  const mockResults = Array.from({ length: Math.floor(Math.random() * 10) + 5 }, (_, i) => ({
    id: i,
    title: `Dokumen "${query}" #${i + 1}`,
    snippet: `Dokumen relevan ${i + 1} yang mengandung "${query}".`,
  }));
  return mockResults;
}
