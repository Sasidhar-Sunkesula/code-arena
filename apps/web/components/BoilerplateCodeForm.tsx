import { Editor } from "@monaco-editor/react";
import { ProblemFormType } from "@repo/common/types";
import { Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Popover, PopoverContent, PopoverTrigger } from "@repo/ui/shad";
import { cn } from "@repo/ui/utils";
import { Check, ChevronsUpDown, Loader2Icon, Trash } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";
import { Language } from "./CodeEditor";
import { Boilerplate } from "./ProblemContributionForm";
import { editorOptions } from "@/lib/utils";

interface BoilerplateCodeFormProps {
    control: Control<ProblemFormType, any>;
    languages: Language[];
}

export function BoilerplateCodeForm({ control, languages }: BoilerplateCodeFormProps) {
    const [selectedLanguageIndex, setSelectedLanguageIndex] = useState<number | null>(null);

    return (
        <FormField
            control={control}
            name="boilerplateCodes"
            render={({ field }) => (
                <FormItem className="space-y-4 flex">
                    <div>
                        <div className="space-y-2 space-x-2">
                            <FormLabel>Select Language</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-[250px] justify-between",
                                                    selectedLanguageIndex === null && "text-muted-foreground"
                                                )}
                                            >
                                                {selectedLanguageIndex !== null
                                                    ? languages[selectedLanguageIndex]?.judge0Name
                                                    : "Select language"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[250px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search language..." />
                                            <CommandList>
                                                <CommandEmpty>No language found.</CommandEmpty>
                                                <CommandGroup>
                                                    {languages.map((language, index) => (
                                                        <CommandItem
                                                            value={language.judge0Name}
                                                            key={language.id}
                                                            onSelect={() => {
                                                                setSelectedLanguageIndex(index);
                                                                // Add the language to boilerplateCodes if not already present
                                                                if (!field.value.some(bpc => bpc.judge0Name === language.judge0Name)) {
                                                                    const newBoilerplate: Boilerplate = {
                                                                        judge0Name: language.judge0Name,
                                                                        initialFunction: "",
                                                                        callerCode: ""
                                                                    };
                                                                    field.onChange([...field.value, newBoilerplate]);
                                                                }
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedLanguageIndex === index
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {language.judge0Name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormDescription>
                                This is the language of the boiler plate code, at least one boilerplate code should be given.
                            </FormDescription>
                        </div>
                        <div className="space-y-2">
                            <FormLabel>Boilerplate Function</FormLabel>
                            <FormControl>
                                <Editor
                                    height={"20vh"}
                                    width={"40vw"}
                                    language={selectedLanguageIndex !== null ? languages[selectedLanguageIndex]?.monacoName : ""}
                                    value={selectedLanguageIndex !== null ? field.value.find(bpc => bpc.judge0Name === languages[selectedLanguageIndex]?.judge0Name)?.initialFunction : ""}
                                    onChange={(value) => {
                                        if (selectedLanguageIndex !== null && languages[selectedLanguageIndex]?.id !== undefined) {
                                            const updatedBoilerPlates = field.value.map((bpc) => {
                                                if (bpc.judge0Name === languages[selectedLanguageIndex]?.judge0Name) {
                                                    return { ...bpc, initialFunction: value || "" };
                                                }
                                                return bpc;
                                            });
                                            field.onChange(updatedBoilerPlates)
                                        }
                                    }}
                                    theme={"vs-dark"}
                                    loading={<Loader2Icon className='w-5 animate-spin' />}
                                    options={{
                                        ...editorOptions,
                                        readOnlyMessage: { value: "Please select a language first!", isTrusted: true },
                                        readOnly: selectedLanguageIndex === null
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                The boiler plate code should only contain a function signature that user has to implement.
                            </FormDescription>
                        </div>
                        <div className="space-y-2">
                            <FormLabel>Caller Code</FormLabel>
                            <FormControl>
                                <Editor
                                    height={"35vh"}
                                    width={"40vw"}
                                    language={selectedLanguageIndex !== null ? languages[selectedLanguageIndex]?.monacoName : ""}
                                    value={selectedLanguageIndex !== null ? field.value.find((bpc) => bpc.judge0Name === languages[selectedLanguageIndex]?.judge0Name)?.callerCode : ""}
                                    onChange={(value) => {
                                        if (selectedLanguageIndex !== null && languages[selectedLanguageIndex]?.id !== undefined) {
                                            const updatedBoilerPlates = field.value.map((bpc) => {
                                                if (bpc.judge0Name === languages[selectedLanguageIndex]?.judge0Name) {
                                                    return { ...bpc, callerCode: value || "" };
                                                }
                                                return bpc;
                                            });
                                            field.onChange(updatedBoilerPlates)
                                        }
                                    }}
                                    theme="vs-dark"
                                    loading={<Loader2Icon className='w-5 animate-spin' />}
                                    options={{
                                        ...editorOptions,
                                        readOnlyMessage: { value: "Please select a language first!", isTrusted: true },
                                        readOnly: selectedLanguageIndex === null
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                This is the input handling code for that function, it should also call the function.
                            </FormDescription>
                            <FormMessage />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <FormLabel>Chosen Boilerplates</FormLabel>
                        <div className="flex flex-wrap gap-2">
                            {field.value.length > 0 ?
                                field.value.map((bpc, index) => (
                                    <div key={bpc.judge0Name} className="grid grid-cols-2 items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="col-span-1"
                                            onClick={() => {
                                                const languageIndex = languages.findIndex(lang => lang.judge0Name === bpc.judge0Name);
                                                setSelectedLanguageIndex(languageIndex);
                                            }}
                                        >
                                            {bpc.judge0Name}
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="col-span-1"
                                            size={"icon"}
                                            onClick={() => {
                                                const updatedBoilerPlates = field.value.filter((_, i) => i !== index);
                                                field.onChange(updatedBoilerPlates);
                                                if (selectedLanguageIndex === index) {
                                                    setSelectedLanguageIndex(null);
                                                }
                                            }}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                                : <div className="text-destructive py-4 text-sm">No boilerplates given</div>
                            }
                        </div>
                    </div>
                </FormItem>
            )}
        />
    );
}