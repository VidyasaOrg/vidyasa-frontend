import { useState } from "react";
import { useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ContentLayout from "@/layouts/ContentLayout";
import SearchConfig from "@/components/SearchConfig";
import BatchUpload from "@/components/BatchUpload";
import type { SingleQueryRequest } from "@/types/search";

function SearchHomePage() {
    const [isInteractive, setIsInteractive] = useState(true);
    const navigate = useNavigate();

    const handleSearch = (config: SingleQueryRequest) => {
        // For now, just navigate with the query
        // Later we can store the full config in state/context if needed
        navigate(`/search?query=${encodeURIComponent(config.query)}`);
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
                        <SearchConfig onSearch={handleSearch} />
                    ) : (
                        <BatchUpload />
                    )}
                </div>
            </div>
        </ContentLayout>
    );
}

export default SearchHomePage;