import type { SingleQueryRequest, SingleQueryResponse, MultiQueryRequest, MultiQueryResponse, DocumentInfo } from "@/types/search";
import { API_CONFIG } from "@/config/api";

export async function termSearch(term: string) {
    const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.termInfo(term)}`);
    const data = await res.json();

    if (res.status === 200) {
        return {
            status: 200,
            data: {
                term: data.term,
                total_occurrences: data.total_occurrences,
                total_documents: data.total_documents,
                docs: data.docs
            },
        };
    }
    return { status: res.status, data: null };
}

export async function docIdSearch(docId: string) {
    const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.documentInfo(docId)}`);
    const data = await res.json();

    if (res.status === 200) {
        const terms: DocumentInfo["terms"] = Object.entries(data.term_postings || {}).map(
            ([term, info]) => {
                const { positions, weight } = (info as { positions: number[], weight: number });
                return {
                    term,
                    raw_tf: positions.length,
                    weight,
                    positions,
                };
            }
        );
        return {
            status: 200,
            data: {
                length: data.document_length,
                unique_terms: data.unique_terms,
                content: data.document_preview || "",
                terms,
                total_terms: data.document_length
            },
        };
    }
    return { status: res.status, data: null };
}

export const singleSearch = async (request: SingleQueryRequest): Promise<SingleQueryResponse> => {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.query}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: request.query,
                is_stemming: request.is_stemming,
                is_stop_words_removal: request.is_stop_words_removal,
                query_term_frequency_method: request.query_term_frequency_method,
                query_term_weighting_method: request.query_term_weighting_method,
                document_term_frequency_method: request.document_term_frequency_method,
                document_term_weighting_method: request.document_term_weighting_method,
                cosine_normalization_query: request.cosine_normalization_query,
                cosine_normalization_document: request.cosine_normalization_document,
                expansion_terms_count: request.expansion_terms_count,
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
    try {
        const formData = new FormData();
        formData.append('file', request.query);
        formData.append('is_stemming', request.is_stemming.toString());
        formData.append('is_stop_words_removal', request.is_stop_words_removal.toString());
        formData.append('query_term_frequency_method', request.query_term_frequency_method);
        formData.append('query_term_weighting_method', request.query_term_weighting_method);
        formData.append('document_term_frequency_method', request.document_term_frequency_method);
        formData.append('document_term_weighting_method', request.document_term_weighting_method);
        formData.append('cosine_normalization_query', request.cosine_normalization_query.toString());
        formData.append('cosine_normalization_document', request.cosine_normalization_document.toString());
        formData.append('expansion_terms_count', request.expansion_terms_count.toString());
        formData.append('is_queries_from_cisi', 'false');

        const response = await fetch('http://localhost:8000/query_batch/', {
            method: 'POST',
            body: formData,
        });

        const status = response.status;

        if (status === 200) {
            const data = await response.json();
            return { status, data };
        }

        return { status };
    } catch (error) {
        console.error('Error during batch search:', error);
        return { status: 500 };
    }
};
