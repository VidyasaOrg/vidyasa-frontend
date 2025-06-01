import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function ParameterSettings() {
    const [additionalTermType, setAdditionalTermType] = useState<"all" | "custom">("all");
    const [additionalTermCount, setAdditionalTermCount] = useState<string>("");

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
                <Label>Metode Term Frequency (TF)</Label>
                <RadioGroup className="flex gap-4 px-8" defaultValue="raw">
                    <div className="flex items-center gap-2">
                        <RadioGroupItem className="hover:cursor-pointer" value="raw" id="raw"/>
                        <Label htmlFor="raw">Raw</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem className="hover:cursor-pointer" value="log" id="log"/>
                        <Label htmlFor="log">Logarithmic</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem className="hover:cursor-pointer" value="binary" id="binary"/>
                        <Label htmlFor="binary">Binary</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem className="hover:cursor-pointer" value="augmented" id="augmented"/>
                        <Label htmlFor="augmented">Augmented</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="flex flex-col gap-4">
                <Label>Jumlah Term Tambahan</Label>
                <div className="flex flex-col gap-4 px-8">
                    <RadioGroup 
                        className="flex gap-4" 
                        defaultValue="all"
                        onValueChange={(value) => {
                            setAdditionalTermType(value as "all" | "custom");
                            if (value === "all") {
                                setAdditionalTermCount("");
                            }
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem className="hover:cursor-pointer" value="all" id="all-terms"/>
                            <Label htmlFor="all-terms">Tambahkan Semua</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem className="hover:cursor-pointer" value="custom" id="custom-terms"/>
                            <Label htmlFor="custom-terms">Kustom</Label>
                        </div>
                    </RadioGroup>
                    {additionalTermType === "custom" && (
                        <Input 
                            id="additional-term"
                            type="text" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={additionalTermCount}
                            placeholder="Masukkan jumlah term"
                            className="max-w-xs"
                            onChange={(e) => {
                                const value = e.target.value;
                                // Only allow positive integers
                                if (value === "" || /^[1-9][0-9]*$/.test(value)) {
                                    setAdditionalTermCount(value);
                                }
                            }}
                            onKeyDown={(e) => {
                                // Prevent non-numeric input
                                if (
                                    // Allow: backspace, delete, tab, escape, enter
                                    ![8, 9, 13, 27, 46].includes(e.keyCode) &&
                                    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                    !(e.ctrlKey === true && ['a', 'c', 'v', 'x'].includes(e.key)) &&
                                    // Prevent: dot, minus, e, and any other non-numeric
                                    (!/[0-9]/.test(e.key) || e.key === '.' || e.key === '-' || e.key === 'e')
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox className="hover:cursor-pointer" id="use-idf" defaultChecked/>
                <Label htmlFor="use-idf">Gunakan Inverse Document Frequency (IDF)</Label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox className="hover:cursor-pointer" id="normalization" defaultChecked/>
                <Label htmlFor="normalization">Gunakan Normalisasi Kosinus</Label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox className="hover:cursor-pointer" id="do-stem"/>
                <Label htmlFor="do-stem">Lakukan Porter Stemming</Label>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox className="hover:cursor-pointer" id="eliminate-stop-words"/>
                <Label htmlFor="eliminate-stop-words">Eliminasi Stop-Words</Label>
            </div>
        </div>
    );
}

export default ParameterSettings;