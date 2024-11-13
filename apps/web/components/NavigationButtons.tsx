import { Button } from "@repo/ui/shad";
import { ArrowLeft, ArrowRight, CheckCheck, Loader2 } from "lucide-react";
import { UseFormTrigger } from "react-hook-form";
interface NavigationButtonsProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
    trigger: UseFormTrigger<any>;
    allDone: boolean;
}
const getFieldsToValidate = (step: number) => {
    switch (step) {
        case 1:
            return ["userName", "problemName", "content", "difficultyLevel"];
        case 2:
            return ["boilerplateCodes"];
        case 3:
            return ["testCases"];
        default:
            return [];
    }
};
export function NavigationButtons({ step, setStep, loading, trigger, allDone }: NavigationButtonsProps) {
    const handleNext = async () => {
        const fieldsToValidate = getFieldsToValidate(step);
        const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
        if (isValid && step < 4) {
            setStep(prev => prev + 1);
        }
    };
    return (
        <div className="flex items-center space-x-4">
            <Button disabled={step === 1} type="button" onClick={() => setStep(prev => prev - 1)}>
                <ArrowLeft className="w-5 mr-2" />
                Back
            </Button>
            {step < 4 && (
                <Button type="button" onClick={handleNext}>
                    Next
                    <ArrowRight className="w-5 ml-2" />
                </Button>
            )}
            {step === 4 && (<Button className="w-28" disabled={loading || !allDone} type="submit">
                {
                    loading
                        ? <Loader2 className="animate-spin" />
                        : <span className="flex items-center">
                            Submit
                            <CheckCheck className="w-5 ml-2" />
                        </span>
                }
            </Button>
            )}
        </div>
    );
}