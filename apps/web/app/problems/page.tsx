import { ProblemListControls } from "@/components/ProblemListControls";

export default function ProblemList() {
    return (
        <div className="px-8 py-6 space-y-5">
            <h2 className="font-medium text-xl">Problem Catalog</h2>
            <ProblemListControls />
        </div>
    );
}