import { ContestForm } from "@/components/ContestForm";
import { ProblemForm } from "@/components/ProblemForm";
import { searchParamsSchema } from "@repo/common/zod";

export default function Contribute({ searchParams }: { searchParams: { type: string } }) {
    // Validate searchParams
    const result = searchParamsSchema.safeParse(searchParams);
    if (!result.success) {
        return (
            <div className="min-h-screen flex justify-center items-center text-destructive font-medium text-xl">
                {result.error.errors[0]?.message}
            </div>
        )
    }
    return (
        <div className="px-8 py-6 space-y-5 w-full">
            <h2 className="text-xl font-medium underline">Contribute a {searchParams.type}</h2>
            {
                result.data.type === "problem"
                    ? <ProblemForm />
                    : <ContestForm />
            }
        </div>
    )
}