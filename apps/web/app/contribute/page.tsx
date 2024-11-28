import { ContestForm } from "@/components/ContestForm";
import { ProblemForm } from "@/components/ProblemForm";
import { searchParamsSchema } from "@repo/common/zod";

export default async function Contribute(props: {
  searchParams: Promise<{ type: string }>;
}) {
  const searchParams = await props.searchParams;
  // Validate searchParams
  const result = searchParamsSchema.safeParse(searchParams);
  if (!result.success) {
    return (
      <div className="min-h-screen flex justify-center items-center text-destructive font-medium text-xl">
        {result.error.errors[0]?.message}
      </div>
    );
  }
  return (
    <div className="px-8 pt-6 space-y-5 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">
          Contribute a {searchParams.type}
        </h2>
        {result.data.type === "problem" && (
          <p className="text-xs">
            *Your progress will be saved locally. You can resume your work later
            if needed.
          </p>
        )}
      </div>
      {result.data.type === "problem" ? <ProblemForm /> : <ContestForm />}
    </div>
  );
}
