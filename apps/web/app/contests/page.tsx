import { OpenContests } from "@/components/OpenContests";

export default function ContestCatalog() {
    return (
        <div className="px-8 py-6 space-y-5">
            <h2 className="text-xl font-medium">Contest Catalog</h2>
            <OpenContests />
        </div>
    )
}