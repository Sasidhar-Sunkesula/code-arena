import { Button } from "@repo/ui/shad";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>
}

export function NavigationButtons({ step, setStep }: NavigationButtonsProps) {
    return (
        <div className="flex items-center space-x-4">
            <Button disabled={step === 1} type="button" onClick={() => setStep(prev => prev - 1)}>
                <ArrowLeft className="w-5 mr-2" />
                Back
            </Button>
            {step < 3 ? (
                <Button type="button" onClick={() => setStep(prev => (prev < 3 ? prev + 1 : prev))}>
                    Next
                    <ArrowRight className="w-5 ml-2" />
                </Button>
            ) : (
                <Button type="submit">
                    Submit
                    <ArrowRight className="w-5 ml-2" />
                </Button>
            )}
        </div>
    );
}