import { useState } from "react";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ContentLayout from "@/layouts/ContentLayout";
import SearchConfig from "@/components/SearchConfig";
import BatchUpload from "@/components/BatchUpload";
import type { SingleQueryRequest, MultiQueryRequest } from "@/types/search";
import { useSearch } from "@/contexts/SearchContext";

function SearchHomePage() {
    const [isInteractive, setIsInteractive] = useState(true);
    const navigate = useNavigate();
    const { searchConfig } = useSearch();

    const handleSearch = (request: SingleQueryRequest) => {
        navigate(`/search?query=${encodeURIComponent(request.query)}`);
    };

    const handleBatchUpload = async (request: MultiQueryRequest) => {
        try {
            // Here you would normally send the request to your API
            // For now, we'll just simulate a delay and navigate
            await new Promise(res => setTimeout(res, 1000));
            navigate('/batch-result');
        } catch (error) {
            // Handle error case
            navigate('/batch-result', { 
                state: { 
                    error: { 
                        status: 500, 
                        message: "Server error" 
                    } 
                } 
            });
        }
    };

    return (
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-24">
                <h1 className="text-5xl font-bold text-center">Mesin Pencari</h1>
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold">Mode Input</h2>
                    <RadioGroup className="flex gap-4" defaultValue="interactive">
                        <div className="flex items-center gap-2">
                            <RadioGroupItem 
                                className="hover:cursor-pointer" 
                                value="interactive" 
                                id="interactive" 
                                onClick={() => setIsInteractive(true)} 
                            />
                            <Label htmlFor="interactive">Interaktif</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem 
                                className="hover:cursor-pointer" 
                                value="batch" 
                                id="batch" 
                                onClick={() => setIsInteractive(false)} 
                            />
                            <Label htmlFor="batch">Batch</Label>
                        </div>
                    </RadioGroup>
                </div>
                
                <div className="w-full">
                    {isInteractive ? (
                        <SearchConfig 
                            onSearch={handleSearch}
                            defaultConfig={searchConfig || undefined}
                        />
                    ) : (
                        <BatchUpload 
                            onUpload={handleBatchUpload}
                            defaultConfig={searchConfig || undefined}
                        />
                    )}
                </div>
            </div>
        </ContentLayout>
    );
}

export default SearchHomePage;