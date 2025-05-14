import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function ParameterSettings() {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
                <Label>Metode Term Frequency (TF)</Label>
                <RadioGroup className="flex gap-4 px-8" defaultValue="raw-tf">
                    <div className="flex items-center gap-2">
                        <RadioGroupItem className="hover:cursor-pointer" value="raw-tf" id="raw-tf"/>
                        <Label htmlFor="raw-tf">Raw</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem className="hover:cursor-pointer" value="log-tf" id="log-tf"/>
                        <Label htmlFor="log-tf">Logarithmic</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem className="hover:cursor-pointer" value="binary-tf" id="binary-tf"/>
                        <Label htmlFor="binary-tf">Binary</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem className="hover:cursor-pointer" value="augmented-tf" id="augmented-tf"/>
                        <Label htmlFor="augmented-tf">Augmented</Label>
                    </div>
                </RadioGroup>
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