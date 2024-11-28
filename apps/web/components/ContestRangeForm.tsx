import { ContestFormType } from "@repo/common/types";
import {
  Button,
  Calendar,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TimePicker,
} from "@repo/ui/shad";
import { cn } from "@repo/ui/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Control, UseFormWatch } from "react-hook-form";

interface ContestRangeFormProps {
  control: Control<ContestFormType, any>;
  watch: UseFormWatch<ContestFormType>;
}
const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};
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
                    suppressHydrationWarning
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP HH:mm")
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
                  selected={new Date(field.value)}
                  onSelect={(date) =>
                    field.onChange(date ? date.toLocaleString() : "")
                  }
                  disabled={(date) =>
                    normalizeDate(date) < normalizeDate(new Date())
                  }
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <TimePicker
                    setDate={(date) =>
                      field.onChange(date ? date.toLocaleString() : undefined)
                    }
                    date={field.value ? new Date(field.value) : undefined}
                  />
                </div>
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
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP HH:mm")
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
                  selected={new Date(field.value)}
                  onSelect={(date) =>
                    field.onChange(date ? date.toLocaleString() : "")
                  }
                  disabled={(date) =>
                    normalizeDate(date) < normalizeDate(new Date(startsOn)) ||
                    normalizeDate(date) < normalizeDate(new Date())
                  }
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <TimePicker
                    setDate={(date) =>
                      field.onChange(date ? date.toLocaleString() : undefined)
                    }
                    date={field.value ? new Date(field.value) : undefined}
                  />
                </div>
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
