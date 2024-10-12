import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@repo/ui/shad";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/shad";
import { Editor } from "@monaco-editor/react";
import { Loader2Icon } from "lucide-react";
import { Control } from "react-hook-form";
import { BoilerplateCodes } from "./ContributionForm";
import { FormData } from "@repo/common/types";

interface BoilerplateCodeFormProps {
    control: Control<FormData, any>;
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
            render={({ field }) => (
                <FormItem className="space-y-4">
                    <div className="space-y-2">
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
                        <FormDescription>
                            This is the language of the boiler plate code, at least one boilerplate code should be given.
                        </FormDescription>
                    </div>
                    <div className="space-y-2">
                        <FormLabel>Boilerplate Code</FormLabel>
                        <FormControl>
                            <Editor
                                height={"50vh"}
                                language={selectedLanguage}
                                value={boilerplateCodes[selectedLanguage]}
                                onChange={(value) => {
                                    handleBoilerplateChange(value || "");
                                    field.onChange({
                                        ...field.value,
                                        [selectedLanguage]: value || ""
                                    });
                                }}
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
                        <FormDescription>
                            The boiler plate code should contain a function that user has to implement and the input handling code for that function. The input handling code should also call the function.
                        </FormDescription>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}