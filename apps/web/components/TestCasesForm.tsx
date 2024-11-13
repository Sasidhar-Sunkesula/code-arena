import { ProblemFormType } from "@repo/common/types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription, Textarea, Button } from "@repo/ui/shad";
import { CircleMinus, Plus } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";

interface TestCasesFormProps {
    control: Control<ProblemFormType, any>;
}

export function TestCasesForm({ control }: TestCasesFormProps) {
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "testCases"
    });
    return (
        <div className="space-y-4">
            <FormLabel>Test Cases</FormLabel>
            <div className="flex flex-wrap gap-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col space-y-2">
                        <FormField
                            control={control}
                            name={`testCases.${index}.input`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Input</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Enter test case input" className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`testCases.${index}.expectedOutput`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expected Output</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Enter expected output" className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" onClick={() => remove(index)}>
                            Remove
                            <CircleMinus className="w-5 ml-2" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button type="button" onClick={() => append({ input: "", expectedOutput: "" })}>
                <Plus className="w-5 mr-2" />
                Add Test Case
            </Button>
            <FormDescription>
                Provide at least 4 test cases. Each test case should have both input and expected output.
            </FormDescription>
        </div>
    );
}