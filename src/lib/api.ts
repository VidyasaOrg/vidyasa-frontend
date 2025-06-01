import type { TermLocations, SingleQueryRequest, SingleQueryResponse, MultiQueryRequest, MultiQueryResponse } from "@/types/search";

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

export const singleSearch = async (request: SingleQueryRequest): Promise<SingleQueryResponse> => {
    // Simulated API call
    await new Promise(res => setTimeout(res, Math.random() * 2000 + 1000));
    
    return {
        original_ranking: [
            { doc_id: 1, similarity_score: 0.85 },
            { doc_id: 2, similarity_score: 0.75 },
            { doc_id: 3, similarity_score: 0.65 }
        ],
        expanded_ranking: [
            { doc_id: 1, similarity_score: 0.90 },
            { doc_id: 2, similarity_score: 0.80 },
            { doc_id: 3, similarity_score: 0.70 }
        ],
        original_query: request.query,
        original_map_score: 0.78,
        original_query_weights: {
            "information": 0.5,
            "retrieval": 0.5
        },
        expanded_query: request.query + " systems",
        expanded_map_score: 0.82,
        expanded_query_weights: {
            "information": 0.4,
            "retrieval": 0.4,
            "systems": 0.2
        }
    };
};

export const batchSearch = async (request: MultiQueryRequest): Promise<{ status: number; data?: MultiQueryResponse }> => {
    // Simulate API call
    await new Promise(res => setTimeout(res, 2000));

    // Randomly simulate different scenarios
    const random = Math.random();
    
    if (random < 0.2) {
        // 20% chance of 400 error
        return { 
            status: 400
        };
    } else if (random < 0.3) {
        // 10% chance of 500 error
        return { 
            status: 500
        };
    } else {
        // 70% chance of success - return the same file back
        return { 
            status: 200,
            data: { 
                result: request.query 
            }
        };
    }
};
