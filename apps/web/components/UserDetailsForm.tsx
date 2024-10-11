import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@repo/ui/shad";
import { Input } from "@repo/ui/shad";
import { Control } from "react-hook-form";

interface UserDetailsFormProps {
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
}

export function UserDetailsForm({ control }: UserDetailsFormProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <FormField
                control={control}
                name="userName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your name</FormLabel>
                        <FormControl>
                            <Input className="w-full md:w-8/12" placeholder="Ratan Tata" {...field} />
                        </FormControl>
                        <FormDescription>
                            This will be visible as contributed by when people look at your problem.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="problemName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name of the problem</FormLabel>
                        <FormControl>
                            <Input className="w-full md:w-8/12" placeholder="Two sum" {...field} />
                        </FormControl>
                        <FormDescription>
                            This will be visible as the problem name. Max characters are 50.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}