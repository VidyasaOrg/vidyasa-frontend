export interface SearchState<T> {
    status: 'idle' | 'loading' | 'success' | 'error';
    data: T | null;
    error: string | null;
}

export interface TermLocations {
    [term: string]: number[];
}

export type TFMethod = 'raw' | 'log' | 'binary' | 'augmented';
export type AdditionalTerms = number | 'all';

export interface SingleQueryRequest {
    query: string;
    stemming: boolean;
    "additional-term": AdditionalTerms;
    "eliminate-stop-word": boolean;
    tf: TFMethod;
    idf: boolean;
    normalization: boolean;
}

export interface RankedDocument {
    doc_id: number;
    similarity_score: number;
}

export interface QueryWeights {
    [term: string]: number;
}

export interface SingleQueryResponse {
    original_ranking: RankedDocument[];
    expanded_ranking: RankedDocument[];
    original_query: string;
    original_map_score: number;
    original_query_weights: QueryWeights;
    expanded_query: string;
    expanded_map_score: number;
    expanded_query_weights: QueryWeights;
} 