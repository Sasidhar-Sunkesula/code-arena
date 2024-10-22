"use client"

import { useSession } from "next-auth/react"
import { Problem, ProblemList } from "./ProblemList"
import { useEffect, useState } from "react";
import { getProblems } from "@/app/actions/getProblems";
import toast, { Toaster } from "react-hot-toast";
import { SearchForProblemList } from "./SearchForProblemList";
import { ProblemListPagination } from "./ProblemListPagination";
import { Loader2 } from "lucide-react";
import { useSearchParams } from 'next/navigation';

export function ProblemListControls() {
    const session = useSession();
    const searchParams = useSearchParams();
    const pageFromParams = searchParams.get('page');
    const limitFromParams = searchParams.get('limit');
    const [page, setPage] = useState<number>(parseInt(pageFromParams ?? '1'))
    const [limit, setLimit] = useState<number>(parseInt(limitFromParams ?? '10'))
    const [loading, setLoading] = useState(true);
    const [problemList, setProblemList] = useState<{ formattedProblemList: Problem[], problemCount: number } | null>(null);
    const [searchKey, setSearchKey] = useState("");

    useEffect(() => {
        async function fetchProblems() {
            try {
                const data = await getProblems(searchKey, page, limit);
                if (data?.formattedProblemList && data?.problemCount) {
                    setProblemList(data)
                }
                else if (data.msg) {
                    throw new Error(data.msg)
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to fetch the problems")
            } finally {
                setLoading(false);
            }
        }
        fetchProblems()
    }, [searchKey, page, limit]);

    if (loading) {
        return (
            <div className="h-28 text-sm border flex justify-center items-center">
                <Loader2 className="w-4 animate-spin" />
            </div>
        )
    }
    return (
        !problemList
            ? <div className="md:h-[450px] border p-2 text-destructive font-semibold flex justify-center items-center">Error while fetching problems</div>
            : <div className="space-y-4">
                <SearchForProblemList
                    searchKey={searchKey}
                    setSearchKey={setSearchKey}
                    problemCount={problemList.problemCount}
                />
                <ProblemList
                    problems={problemList.formattedProblemList}
                    contestId={null} // No contest in this case
                    userId={session?.data?.user?.id || null}
                />
                <ProblemListPagination
                    page={page}
                    limit={limit}
                    setLimit={setLimit}
                    totalProblems={problemList.problemCount}
                    setPage={setPage}
                />
                <Toaster />
            </div>
    )
}