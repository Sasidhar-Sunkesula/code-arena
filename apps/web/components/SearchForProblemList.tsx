import { Input } from "@repo/ui/shad";

interface SearchForProblemListProps {
    problemCount: number;
    searchKey: string;
    setSearchKey: React.Dispatch<React.SetStateAction<string>>
}
export function SearchForProblemList({ problemCount, searchKey, setSearchKey }: SearchForProblemListProps) {
    return (
        <div>
            <Input
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder={`Search here in the list of ${problemCount} problems...`}
            />
        </div>
    )
}