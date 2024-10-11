import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@repo/ui/shad";
import { Control, FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";
import { Button } from "@repo/ui/shad";

interface TestCasesFormProps {
    control: Control<{
        problemName: string;
        userName: string;
        content: string;
        boilerplateCodes: Record<string, string>;
        testCases: {
            input: string;
            expected_output: string;
        }[];
    }, any>
    fields: FieldArrayWithId<{
        problemName: string;
        userName: string;
        content: string;
        boilerplateCodes: Record<string, string>;
        testCases: {
            input: string;
            expected_output: string;
        }[];
    }, "testCases", "id">[];
    append: UseFieldArrayAppend<{
        testCases: {
            input: string;
            expected_output: string;
        }[];
        problemName: string;
        userName: string;
        content: string;
        boilerplateCodes: Record<string, string>;
    }, "testCases">;
    remove: UseFieldArrayRemove;
}

export function TestCasesForm({ control, fields, append, remove }: TestCasesFormProps) {
    return (
        <div>
            <FormLabel>Test Cases</FormLabel>
            {fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                    <FormField
                        control={control}
                        name={`testCases.${index}.input`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Input</FormLabel>
                                <FormControl>
                                    <textarea {...field} rows={3} className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`testCases.${index}.expected_output`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Expected Output</FormLabel>
                                <FormControl>
                                    <textarea {...field} rows={3} className="w-full" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button" onClick={() => remove(index)}>Remove</Button>
                </div>
            ))}
            <Button type="button" onClick={() => append({ input: "", expected_output: "" })}>Add Test Case</Button>
            <FormDescription>
                Provide at least 4 test cases. Each test case should have both input and expected output.
            </FormDescription>
        </div>
    );
}