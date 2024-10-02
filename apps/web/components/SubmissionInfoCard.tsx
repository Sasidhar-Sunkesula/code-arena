import { Button } from "@repo/ui/shad";
import { Submission } from "./ProblemSubmissions";
import { Cpu, Timer } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/shad";

type SubmissionInfoProps = Omit<Submission, "id">;

const SubmissionInfoCard: React.FC<SubmissionInfoProps> = ({ status, submittedCode, testCaseCount, createdAt, runTime, memory, testCasesPassed }) => {
    return (
        <div className="border-2 rounded-md py-2 px-4 flex items-center justify-between">
            <div className="space-y-1">
                <div className="text-sm">
                    <span className="font-medium">Status : </span>
                    {status}
                </div>
                <div className="text-sm">
                    <span className="font-medium">Created At : </span>
                    {createdAt.toLocaleString('en-US', { year: '2-digit', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
            <Dialog>
                <DialogTrigger>
                    <Button>View Code</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader className="space-y-6">
                        <DialogTitle>Submitted Code</DialogTitle>
                        <DialogDescription className="p-2 dark:text-primary">
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
    );
};

export default SubmissionInfoCard;