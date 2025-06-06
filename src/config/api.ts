export const API_CONFIG = {
    baseUrl: 'http://localhost:8000',
    endpoints: {
        termInfo: (term: string) => `/inverted_file/term/${encodeURIComponent(term)}`,
        documentInfo: (docId: string) => `/inverted_file/document/${encodeURIComponent(docId)}`,
        query: '/query',
        queryExp: '/query/exp',
        queryBatch: '/query_batch',
        queryBatchExp: '/query_batch/exp'
    }
} as const; 