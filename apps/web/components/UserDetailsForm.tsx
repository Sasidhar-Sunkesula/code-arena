import { DifficultyLevel, FormData } from "@repo/common/types";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@repo/ui/shad";
import { Input } from "@repo/ui/shad";
import { Control } from "react-hook-form";

interface UserDetailsFormProps {
    control: Control<FormData, any>;
    labels: {
        userName: string;
        problemName: string;
        difficultyLevel: string;
    };
    descriptions: {
        userName: string;
        problemName: string;
        difficultyLevel: string;
    };
    placeholders: {
        userName: string;
        problemName: string;
    }
}

export function UserDetailsForm({ control, labels, descriptions, placeholders }: UserDetailsFormProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <FormField
                control={control}
                name="userName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{labels.userName}</FormLabel>
                        <FormControl>
                            <Input className="w-full md:w-11/12" placeholder={placeholders.userName} {...field} />
                        </FormControl>
                        <FormDescription>
                            {descriptions.userName}
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
                        <FormLabel>{labels.problemName}</FormLabel>
                        <FormControl>
                            <Input className="w-full md:w-11/12" placeholder={placeholders.problemName} {...field} />
                        </FormControl>
                        <FormDescription>
                            {descriptions.problemName}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="difficultyLevel"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{labels.difficultyLevel}</FormLabel>
                        <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-[220px]">
                                    <SelectValue placeholder="Select Difficulty Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={DifficultyLevel.EASY}>Easy</SelectItem>
                                    <SelectItem value={DifficultyLevel.MEDIUM}>Medium</SelectItem>
                                    <SelectItem value={DifficultyLevel.HARD}>Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormDescription>
                            {descriptions.difficultyLevel}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}