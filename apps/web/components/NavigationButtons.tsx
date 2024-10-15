import { Button } from "@repo/ui/shad";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface NavigationButtonsProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean
}

export function NavigationButtons({ step, setStep, loading }: NavigationButtonsProps) {
    return (
        <div className="flex items-center space-x-4">
            <Button disabled={step === 1} type="button" onClick={() => setStep(prev => prev - 1)}>
                <ArrowLeft className="w-5 mr-2" />
                Back
            </Button>
            {step < 4 ? (
                <Button type="button" onClick={() => setStep(prev => (prev < 4 ? prev + 1 : prev))}>
                    Next
                    <ArrowRight className="w-5 ml-2" />
                </Button>
            ) : (
                <Button disabled={loading} type="submit">
                    {
                        loading
                            ? <Loader2 className="animate-spin" />
                            : <span className="flex items-center">
                                Submit
                                <ArrowRight className="w-5 ml-2" />
                            </span>
                    }
                </Button>
            )}
        </div>
    );
}