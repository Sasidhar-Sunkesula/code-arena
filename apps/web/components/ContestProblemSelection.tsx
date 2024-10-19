import { searchProblems } from "@/app/actions/searchProblems";
import { ContestFormType } from "@repo/common/types";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from "@repo/ui/shad";
import { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import toast from "react-hot-toast";

interface ContestProblemSelectionProps {
    control: Control<ContestFormType, any>;
}
export function ContestProblemSelection({ control }: ContestProblemSelectionProps) {
    const [searchKey, setSearchKey] = useState("");
    const [searchResults, setSearchResults] = useState<{ id: number, name: string }[]>([]);
    useEffect(() => {
        async function getSearchResults() {
            try {
                const results = await searchProblems(searchKey);
                if (results.searchResults) {
                    console.log(results.searchResults);

                    setSearchResults(results.searchResults)
                } else if (results.msg) {
                    throw new Error(results.msg)
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to get the search results")
            }
        }
        if (searchKey.trim()) {
            getSearchResults()
        }
    }, [searchKey])
    return (
        <div>
            <FormField
                control={control}
                name="problemIds"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Select problems</FormLabel>
                        <div className="h-48 w-full md:w-6/12 space-y-3">
                            <Input
                                value={searchKey}
                                placeholder="Enter the name of problem here..."
                                onChange={(e) => setSearchKey(e.target.value)}
                            />
                            <div className="border rounded-sm">
                                {searchResults.length === 0
                                    ? <div>No results found</div>
                                    : searchResults.map(result => (
                                        <div className="p-2 border">{result.name}</div>
                                    ))
                                }
                            </div>
                        </div>
                        <FormDescription>
                            Select problems for the contest minimum 1 problem should be selected.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}