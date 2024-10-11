import { ContributionForm } from "@/components/ContributionForm";
import { Stepper } from "@/components/Stepper";
import { z } from "zod"

const searchParamsSchema = z.object({
    type: z.enum(["contest", "problem"], {
        message: "Type must be either 'contest' or 'problem'",
    }),
});
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
            <div className="flex w-full gap-x-14 justify-between items-center">
                <Stepper />
                <div className="flex-grow max-w-7xl">
                    <ContributionForm />
                </div>
            </div>
        </div>
    )
}