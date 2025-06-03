export const API_CONFIG = {
    baseUrl: 'http://localhost:8000',
    endpoints: {
        termInfo: (term: string) => `/query/term-info/${encodeURIComponent(term)}`,
        documentInfo: (docId: string) => `/query/document-info/${encodeURIComponent(docId)}`
    }
} as const; 