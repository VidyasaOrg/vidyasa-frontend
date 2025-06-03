import type { SingleQueryRequest, SingleQueryResponse, MultiQueryRequest, MultiQueryResponse, TermInfo, DocumentInfo } from "@/types/search";
import { API_CONFIG } from "@/config/api";

export const termSearch = async (term: string): Promise<{ status: number; data?: TermInfo }> => {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.termInfo(term)}`);
        const status = response.status;

        if (status === 200) {
            const data = await response.json();
            return { status, data };
        }

        return { status };
    } catch (error) {
        console.error('Error fetching term info:', error);
        return { status: 500 };
    }
};

export const docIdSearch = async (docId: string): Promise<{ status: number; data?: DocumentInfo }> => {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.documentInfo(docId)}`);
        const status = response.status;

        if (status === 200) {
            const data = await response.json();
            return { status, data };
        }

        return { status };
    } catch (error) {
        console.error('Error fetching document info:', error);
        return { status: 500 };
    }
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
