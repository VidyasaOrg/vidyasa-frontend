import type { SingleQueryRequest, SingleQueryResponse, MultiQueryRequest, MultiQueryResponse, DocumentInfo } from "@/types/search";
import { API_CONFIG } from "@/config/api";

export async function termSearch(term: string) {
    const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.termInfo(term)}`);
    const data = await res.json();

    if (res.status === 200) {
        const documents = Object.entries(data.term_postings || {}).map(
            ([doc_id, positions]) => {
                const posArr = Array.isArray(positions) ? positions as number[] : [];
                return {
                    doc_id: Number(doc_id),
                    raw_tf: posArr.length,
                    tf: posArr.length, 
                    weight: 1,
                    positions: posArr,
                    document_preview: "", 
                    idf: 1, 
                };
            }
        );
        return {
            status: 200,
            data: {
                term: data.term || term,
                document_frequency: documents.length,
                total_occurrences: documents.reduce((sum, d) => sum + d.raw_tf, 0),
                documents,
            },
        };
    }
    return { status: res.status, data: null };
}

export async function docIdSearch(docId: string) {
    const res = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.documentInfo(docId)}`);
    const data = await res.json();

    // Transform backend response to DocumentInfo
    if (res.status === 200) {
        // Example transformation, adjust as needed
        const terms: DocumentInfo["terms"] = Object.entries(data.term_postings || {}).map(
            ([term, positions]) => {
                const posArr = Array.isArray(positions) ? positions as number[] : [];
                return {
                    term,
                    raw_tf: posArr.length,
                    weight: 1, // or calculate if available
                    positions: posArr,
                };
            }
        );
        return {
            status: 200,
            data: {
                length: terms.reduce((sum, t) => sum + t.raw_tf, 0),
                unique_terms: terms.length,
                content: "", // fill if available from backend
                terms,
                total_terms: terms.reduce((sum, t) => sum + t.raw_tf, 0),
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
