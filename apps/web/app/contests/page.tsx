import { OpenContests } from "@/components/OpenContests";

export default function ContestCatalog() {
    return (
        <div className="px-3 py-4">
            <div className="px-4 md:px-8">
                <h2 className="text-xl text-left font-medium">Contest Catalog</h2>
            </div>
            <OpenContests />
        </div>
    )
}