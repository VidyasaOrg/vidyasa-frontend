import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { MultiQueryRequest, MultiQueryResponse, APIError } from '@/types/search';

interface BatchContextType {
    request: MultiQueryRequest | null;
    setRequest: (request: MultiQueryRequest | null) => void;
    response: MultiQueryResponse | null;
    setResponse: (response: MultiQueryResponse | null) => void;
    error: APIError | null;
    setError: (error: APIError | null) => void;
    isProcessing: boolean;
    setIsProcessing: (isProcessing: boolean) => void;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

export function BatchProvider({ children }: { children: ReactNode }) {
    const [request, setRequest] = useState<MultiQueryRequest | null>(null);
    const [response, setResponse] = useState<MultiQueryResponse | null>(null);
    const [error, setError] = useState<APIError | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    return (
        <BatchContext.Provider 
            value={{ 
                request, 
                setRequest, 
                response, 
                setResponse, 
                error, 
                setError,
                isProcessing,
                setIsProcessing
            }}
        >
            {children}
        </BatchContext.Provider>
    );
}

export function useBatch() {
    const context = useContext(BatchContext);
    if (context === undefined) {
        throw new Error('useBatch must be used within a BatchProvider');
    }
    return context;
} 