"use client"

import { ContestLevel, DifficultyLevel } from "@repo/common/types";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Button } from "@repo/ui/shad";
import { Control, UseFormWatch } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@repo/ui/utils"
import { Calendar } from "@repo/ui/shad"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@repo/ui/shad"
import { format } from "date-fns"

interface ContestRangeFormProps {
    control: Control<{
        contestName: string;
        userName: string;
        difficultyLevel: ContestLevel;
        startsOn: Date;
        endsOn: Date;
    }, any>;
    watch: UseFormWatch<{
        contestName: string;
        userName: string;
        difficultyLevel: ContestLevel;
        startsOn: Date;
        endsOn: Date;
    }>
}
export function ContestRangeForm({ control, watch }: ContestRangeFormProps) {
    const startsOn = watch("startsOn");
    return (
        <div className="flex items-center flex-wrap gap-10">
            <FormField
                control={control}
                name="startsOn"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Contest Start Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date < new Date("1900-01-01") || date < new Date()
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                            Contest start date can be in the future
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="endsOn"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Contest End Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date < new Date("1900-01-01") || date < startsOn || date < new Date()
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                            Contest end date must be on or after the start date
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}