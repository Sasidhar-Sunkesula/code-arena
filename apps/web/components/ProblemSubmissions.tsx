"use client";

import { getSubmissions } from "@/app/actions/getSubmissions";
import { SubmissionStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SubmissionInfoCard from "./SubmissionInfoCard";

export type Submission = {
  id: number;
  status: SubmissionStatus;
  submittedCode: string;
  createdAt: Date;
  runTime: number | null;
  memory: number | null;
  testCasesPassed: number | null;
  points: number | null;
  testCaseCount: number;
};
type SubmissionResponse = {
  msg?: string;
  submissions?: Submission[];
};
export function ProblemSubmissions({
  problemId,
  contestId,
}: {
  problemId: number;
  contestId?: number;
}) {
  const [submissionList, setSubmissionList] =
    useState<SubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const submissions = await getSubmissions(problemId, contestId);
        if (submissions?.msg) {
          throw new Error(submissions.msg);
        }
        setSubmissionList(submissions);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error while fetching submissions",
        );
      } finally {
        setLoading(false);
      }
    }
    session && session.user && fetchSubmissions();
  }, []);

  if (!session || !session.user) {
    return (
      <div className="flex justify-center border items-center w-full text-destructive font-medium md:min-h-96">
        Login to view your submissions
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full md:h-[60vh]">
        <Loader2 className="w-5 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <Toaster />
      {!submissionList || !submissionList.submissions ? (
        <div className="md:h-[60vh] border p-2 text-destructive font-medium flex justify-center items-center">
          Error while fetching submissions
        </div>
      ) : submissionList.submissions.length === 0 ? (
        <div className="md:h-[60vh] border p-2 font-semibold flex justify-center items-center">
          No submissions yet!
        </div>
      ) : (
        <div className="space-y-2 md:h-[60vh] overflow-y-auto">
          {contestId && (
            <p className="text-sm text-center">
              Submissions shown here are contest specific.
            </p>
          )}
          {submissionList.submissions.map((submission) => (
            <SubmissionInfoCard
              key={submission.id}
              points={submission.points}
              submittedCode={submission.submittedCode}
              status={submission.status}
              createdAt={submission.createdAt}
              runTime={submission.runTime}
              memory={submission.memory}
              testCasesPassed={submission.testCasesPassed}
              testCaseCount={submission.testCaseCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
