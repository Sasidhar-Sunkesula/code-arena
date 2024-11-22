import { Button } from "@repo/ui/shad";
import { Submission } from "./ProblemSubmissions";
import { CircleDollarSign, Cpu, Timer } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/shad";
import { format } from "date-fns";

type SubmissionInfoProps = Omit<Submission, "id">;

const SubmissionInfoCard: React.FC<SubmissionInfoProps> = ({ points, status, submittedCode, testCaseCount, createdAt, runTime, memory, testCasesPassed }) => {
    return (
        <div className="border-2 rounded-md py-2 px-4 flex items-center justify-between">
            <div className="space-y-1">
                <div className="text-sm">
                    <span className="font-medium">Status : </span>
                    {status}
                </div>
                <div className="text-sm">
                    <span className="font-medium">Created At : </span>
                    {format(createdAt, "yyyy-MM-dd")}
                </div>
                <div className="text-sm">
                    <span className="font-medium">Test Cases Passed : </span>
                    {testCasesPassed !== null ? (testCasesPassed + " / " + testCaseCount) : "NA"}
                </div>
            </div>
            <div className="text-sm">
                <div className="flex items-center gap-x-1">
                    <Timer className="w-4" />
                    {((runTime ?? 0) * 1000).toFixed(2)} ms
                </div>
                <div className="flex items-center gap-x-1">
                    <Cpu className="w-4" />
                    {((memory ?? 0) / 1024).toFixed(1)} MB
                </div>
            </div>
            <div className="space-y-1 flex flex-col items-end">
                <div className="flex items-center gap-x-1">
                    <CircleDollarSign className="w-4" />
                    <span className="text-sm font-medium">Points : {points}</span>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={"sm"} className="text-xs">View Code</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader className="space-y-6">
                            <DialogTitle>Submitted Code</DialogTitle>
                            <DialogDescription asChild className="p-2 dark:text-primary">
                                <pre>
                                    <code>
                                        {submittedCode}
                                    </code>
                                </pre>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default SubmissionInfoCard;