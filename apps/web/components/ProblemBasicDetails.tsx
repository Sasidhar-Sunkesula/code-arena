import { DifficultyLevel, ProblemFormType } from "@repo/common/types";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@repo/ui/shad";
import { Input } from "@repo/ui/shad";
import { Control } from "react-hook-form";

interface ProblemBasicDetailsProps {
    control: Control<ProblemFormType, any>;
}

export function ProblemBasicDetails({ control }: ProblemBasicDetailsProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <FormField
                control={control}
                name="userName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your name</FormLabel>
                        <FormControl>
                            <Input className="w-full md:w-11/12" placeholder="Ratan Tata" {...field} />
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
                            <Input className="w-full md:w-11/12" placeholder="Two sum" {...field} />
                        </FormControl>
                        <FormDescription>
                            This will be visible as the problem name. Max characters are 50.
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
                        <FormLabel>Difficulty Level</FormLabel>
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
                            Select the difficulty level of the problem.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}