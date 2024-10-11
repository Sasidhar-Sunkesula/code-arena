import { Button } from "@repo/ui/shad";

interface NavigationButtonsProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>
}

export function NavigationButtons({ step, setStep }: NavigationButtonsProps) {
    return (
        <div className="flex items-center space-x-4">
            <Button disabled={step === 1} type="button" onClick={() => setStep(prev => prev - 1)}>Back</Button>
            {step < 3 ? (
                <Button type="button" onClick={() => setStep(prev => (prev < 3 ? prev + 1 : prev))}>
                    Next
                </Button>
            ) : (
                <Button type="submit">
                    Submit
                </Button>
            )}
        </div>
    );
}