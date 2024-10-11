import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@repo/ui/shad";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/shad";
import { Editor } from "@monaco-editor/react";
import { Loader2Icon } from "lucide-react";
import { Control } from "react-hook-form";
import { BoilerplateCodes } from "./ContributionForm";

interface BoilerplateCodeFormProps {
    control: Control<{
        problemName: string;
        userName: string;
        content: string;
        boilerplateCodes?: Record<string, string> | undefined;
    }> | undefined;
    selectedLanguage: string;
    handleLanguageChange: (language: string) => void;
    boilerplateCodes: BoilerplateCodes;
    handleBoilerplateChange: (value: string) => void;
}

export function BoilerplateCodeForm({
    control,
    selectedLanguage,
    handleLanguageChange,
    boilerplateCodes,
    handleBoilerplateChange
}: BoilerplateCodeFormProps) {
    return (
        <FormField
            control={control}
            name="boilerplateCodes"
            render={() => (
                <FormItem>
                    <FormLabel>Select Language</FormLabel>
                    <FormControl>
                        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="JavaScript">JavaScript</SelectItem>
                                <SelectItem value="Python">Python</SelectItem>
                                <SelectItem value="Java">Java</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormLabel>Boilerplate Code</FormLabel>
                    <FormControl>
                        <Editor
                            height={"50vh"}
                            language={selectedLanguage}
                            value={boilerplateCodes[selectedLanguage]}
                            onChange={(value) => handleBoilerplateChange(value || "")}
                            theme="vs-dark"
                            loading={<Loader2Icon className='w-5 animate-spin' />}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 16,
                                padding: {
                                    top: 6,
                                    bottom: 4
                                },
                                smoothScrolling: true,
                                lineNumbers: 'on',
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                selectOnLineNumbers: true
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}