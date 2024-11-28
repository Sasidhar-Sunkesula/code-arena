import { ContestFormType, ContestLevel } from "@repo/common/types";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/shad";
import { Control } from "react-hook-form";

interface ContestBasicDetailsProps {
  control: Control<ContestFormType, any>;
}

export function ContestBasicDetails({ control }: ContestBasicDetailsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <FormField
        control={control}
        name="userName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your name</FormLabel>
            <FormControl>
              <Input
                className="w-full md:w-11/12"
                placeholder="Ratan Tata"
                {...field}
              />
            </FormControl>
            <FormDescription>
              This will be visible as contributed by when people look at your
              contest.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="contestName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contest Name</FormLabel>
            <FormControl>
              <Input
                className="w-full md:w-11/12"
                placeholder="Basic Booster"
                {...field}
              />
            </FormControl>
            <FormDescription>
              This will be visible as the contest name. Max characters are 50.
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
                <SelectTrigger className="w-full md:w-11/12">
                  <SelectValue placeholder="Select Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ContestLevel.BEGINNER}>
                    Beginner
                  </SelectItem>
                  <SelectItem value={ContestLevel.INTERMEDIATE}>
                    Intermediate
                  </SelectItem>
                  <SelectItem value={ContestLevel.ADVANCED}>
                    Advanced
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Select the difficulty level of the contest.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
