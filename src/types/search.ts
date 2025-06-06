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
export type TermWeightingMethod = 'tf' | 'idf' | 'tf_idf';

export interface QueryDocumentConfig {
    is_stemming: boolean;
    expansion_terms_count: AdditionalTerms;
    is_stop_words_removal: boolean;
    query_term_frequency_method: TFMethod;
    query_term_weighting_method: TermWeightingMethod;
    document_term_frequency_method: TFMethod;
    document_term_weighting_method: TermWeightingMethod;
    cosine_normalization_query: boolean; 
    cosine_normalization_document: boolean;
    query_expansion_type?: "prompt" | "no_prompt";
}

export type SingleQueryRequest = {
    query: string;
    is_queries_from_cisi: boolean;
} & QueryDocumentConfig;

export type MultiQueryRequest = {
    query: File;
    is_queries_from_cisi: boolean;
} & QueryDocumentConfig;

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
    document_preview: string;
    weight: number;
}

export interface TermInfo {
    term: string;
    total_occurrences: number;
    total_documents: number;
    docs: TermDocument[];
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