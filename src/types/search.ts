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

export interface QueryConfig {
    is_stemming: boolean;
    expansion_terms_count: AdditionalTerms;
    is_stop_words_removal: boolean;
    term_frequency_method: TFMethod;
    idf: boolean;
    normalization: boolean;
}

export interface SingleQueryRequest {
    query: string;
    config: QueryConfig;
}

export interface MultiQueryRequest {
    query: File;
    config: QueryConfig;
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

export interface MultiQueryResponse {
    result: File;
}

export interface APIError {
    status: 400 | 500;
    message: string;
} 