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
export type TermWeightingMethod = 'tf' | 'idf' | 'tf_idf' | 'tf_idf_norm';

export interface QueryConfig {
    is_stemming: boolean;
    expansion_terms_count: AdditionalTerms;
    is_stop_words_removal: boolean;
    term_frequency_method: TFMethod;
    term_weighting_method: TermWeightingMethod;
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
    doc_title: string;
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
    results: SingleQueryResponse[];
}

export interface APIError {
    status: 400 | 500;
    message: string;
}

export interface TermDocument {
    doc_id: number;
    raw_tf: number;
    tf: number;
    weight: number;
    positions: number[];
    document_preview: string;
    idf: number;
}

export interface TermInfo {
    term: string;
    document_frequency: number;
    total_occurrences: number;
    documents: TermDocument[];
}

export interface DocumentTerm {
    term: string;
    raw_tf: number;
    weight: number;
    positions: number[];
}

export interface DocumentInfo {
    length: number;
    unique_terms: number;
    content: string;
    terms: DocumentTerm[];
    total_terms: number;
} 