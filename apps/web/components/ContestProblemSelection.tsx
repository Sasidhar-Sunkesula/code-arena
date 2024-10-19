import { searchProblems } from "@/app/actions/searchProblems";
import { ContestFormType } from "@repo/common/types";
import { Button, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from "@repo/ui/shad";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import toast from "react-hot-toast";

interface ContestProblemSelectionProps {
    control: Control<ContestFormType, any>;
    setSelectedProblems: React.Dispatch<React.SetStateAction<{ id: number, name: string }[]>>;
}
export function ContestProblemSelection({ control, setSelectedProblems }: ContestProblemSelectionProps) {
    const [searchKey, setSearchKey] = useState("");
    const [searchResults, setSearchResults] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function getSearchResults() {
            try {
                setLoading(true);
                const results = await searchProblems(searchKey);
                if (results.searchResults) {
                    setSearchResults(results.searchResults)
                } else if (results.msg) {
                    throw new Error(results.msg)
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to get the search results")
            } finally {
                setLoading(false);
            }
        }
        if (searchKey.trim()) {
            getSearchResults()
        } else {
            setSearchResults([])
        }
    }, [searchKey])
    return (
        <FormField
            control={control}
            name="problemIds"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Select problems</FormLabel>
                    <div className="space-y-3">
                        <Input
                            value={searchKey}
                            placeholder="Enter the name of problem here..."
                            onChange={(e) => setSearchKey(e.target.value)}
                        />
                        <div className={`border rounded-sm space-y-1 min-h-48 flex 
                                ${searchKey.trim() && !loading && searchResults.length > 0
                                ? "flex-col justify-start p-1"
                                : "flex-row justify-center items-center"}`}
                        >
                            {!searchKey.trim() && <div className="text-sm">Search something at first</div>}
                            {searchKey.trim() && loading && <Loader2 className="animate-spin w-4" />}
                            {searchKey.trim() && !loading && searchResults.length > 0 && (
                                searchResults.map(result => (
                                    <Button
                                        variant={"outline"}
                                        key={result.id}
                                        onClick={() => {
                                            const newProblemIds = [...field.value, result.id];
                                            field.onChange(newProblemIds);
                                            setSelectedProblems(prev => [...prev, result])
                                        }}
                                        className="w-full"
                                    >
                                        {result.name}
                                    </Button>
                                ))
                            )}
                            {searchKey.trim() && !loading && searchResults.length === 0 && <div className="text-sm">No results found</div>}
                        </div>
                    </div>
                    <FormDescription>
                        Select problems for the contest minimum 1 problem should be selected.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}