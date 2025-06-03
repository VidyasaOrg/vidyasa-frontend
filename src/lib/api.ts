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
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.query}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: request.query,
                is_stemming: request.config.is_stemming,
                is_stop_words_removal: request.config.is_stop_words_removal,
                term_frequency_method: request.config.term_frequency_method,
                term_weighting_method: request.config.term_weighting_method,
                expansion_terms_count: request.config.expansion_terms_count,
                is_queries_from_cisi: false
            }),
        });

        if (!response.ok) {
            throw new Error('Search request failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during search:', error);
        throw error;
    }
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
