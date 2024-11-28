import { ContestFormType } from "@repo/common/types";
import { Button, Input, Label } from "@repo/ui/shad";
import { CircleX } from "lucide-react";
import { useState } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface ContestSelectedProblemsProps {
  watch: UseFormWatch<ContestFormType>;
  setValue: UseFormSetValue<ContestFormType>;
  selectedProblems: { id: number; name: string }[];
  setSelectedProblems: React.Dispatch<
    React.SetStateAction<{ id: number; name: string }[]>
  >;
}

export function ContestSelectedProblems({
  watch,
  selectedProblems,
  setValue,
  setSelectedProblems,
}: ContestSelectedProblemsProps) {
  const [searchKey, setSearchKey] = useState<string>("");
  const problemIds = watch("problemIds");
  const filteredProblems = selectedProblems.filter((problem) =>
    problem.name.toLowerCase().includes(searchKey.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <Label>Selected problems</Label>
      <Input
        value={searchKey}
        placeholder="Search for the selected problem here..."
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <div
        className={`border rounded-sm space-y-1 min-h-48 flex 
                ${
                  filteredProblems.length > 0
                    ? "flex-col justify-start p-1"
                    : "flex-row justify-center items-center"
                }`}
      >
        {!searchKey.trim() && filteredProblems.length === 0 && (
          <div className="text-sm">Search something at first</div>
        )}
        {filteredProblems.length > 0 &&
          filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="flex justify-between items-start w-full border gap-x-1"
            >
              <div className="text-sm py-2 px-3 flex-grow rounded-sm cursor-default">
                {problem.name}
              </div>
              <Button
                variant={"outline"}
                size={"icon"}
                className="border-none rounded-full"
                onClick={() => {
                  const newProblemIds = problemIds.filter(
                    (id) => id !== problem.id,
                  );
                  const newSelectedProblems = selectedProblems.filter(
                    (p) => p.id !== problem.id,
                  );
                  setSelectedProblems(newSelectedProblems);
                  setValue("problemIds", newProblemIds);
                }}
              >
                <CircleX className="w-4" />
              </Button>
            </div>
          ))}
        {searchKey.trim() && filteredProblems.length === 0 && (
          <div className="text-sm">No results found</div>
        )}
      </div>
    </div>
  );
}
