export const API_CONFIG = {
    baseUrl: 'http://localhost:8000',
    endpoints: {
        termInfo: (term: string) => `/inverted_file/term/${encodeURIComponent(term)}`,
        documentInfo: (docId: string) => `/inverted_file/document/${encodeURIComponent(docId)}`,
        query: '/query'
    }
} as const; 