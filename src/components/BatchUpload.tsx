import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function BatchUpload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const validateAndSetFile = (file: File) => {
        if (file.type === "application/json") {
            setSelectedFile(file);
            return true;
        } else {
            setSelectedFile(null);
            alert("Please select a JSON file");
            return false;
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
        // Reset input value to allow selecting the same file again
        event.target.value = '';
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const file = event.dataTransfer.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const handleProcessBatch = () => {
        // For now, just navigate to an empty page
        navigate("/search");
    };

    return (
        <div className="flex flex-col gap-4">
            <div 
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 transition-colors",
                    isDragging ? "border-primary bg-primary/5" : "hover:border-primary/50"
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-4">
                    <UploadIcon className={cn(
                        "w-8 h-8 transition-colors",
                        isDragging ? "text-primary" : "text-muted-foreground"
                    )} />
                    <div className="flex flex-col items-center gap-1">
                        <Label 
                            htmlFor="file-upload" 
                            className="text-sm font-medium hover:cursor-pointer hover:text-primary/90 transition-colors"
                        >
                            {selectedFile ? selectedFile.name : "Upload file JSON"}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Klik untuk memilih file atau drag and drop
                        </p>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".json,application/json"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </div>
            <Button 
                onClick={handleProcessBatch}
                disabled={!selectedFile}
                className="w-full hover:cursor-pointer"
            >
                Proses Batch Query
            </Button>
        </div>
    );
}

export default BatchUpload; 