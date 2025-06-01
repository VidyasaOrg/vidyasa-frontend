import ParameterSettings from "@/components/ParameterSettings";
import SearchBar from "@/components/SearchBar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ContentLayout from "@/layouts/ContentLayout";
import { useState } from "react";
import BatchUpload from "@/components/BatchUpload";

function SearchHomePage() {
    const [isInteractive, setIsInteractive] = useState(true);

    return (
        <ContentLayout>
            <div className="min-h-screen flex flex-col gap-8 py-24">
                <h1 className="text-5xl font-bold text-center">Mesin Pencari</h1>
                <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold">Input Query</h2>
                    <RadioGroup className="flex gap-4" defaultValue="interactive">
                        <div className="flex items-center gap-2">
                            <RadioGroupItem className="hover:cursor-pointer" value="interactive" id="interactive" onClick={() => setIsInteractive(true)} />
                            <Label htmlFor="interactive">Interactive</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem className="hover:cursor-pointer" value="batch" id="batch" onClick={() => setIsInteractive(false)} />
                            <Label htmlFor="batch">Batch</Label>
                        </div>
                    </RadioGroup>
                </div>
                {isInteractive ? <SearchBar autoFocus /> : <BatchUpload />}
                <div className="flex flex-col gap-8 mt-4">
                    <h2 className="text-xl font-bold">Pengaturan Lanjut</h2>
                    <ParameterSettings />
                </div>
            </div>
        </ContentLayout>
    );
}

export default SearchHomePage;