import { Button } from "@repo/ui/shad";

interface NavigationButtonsProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>
}

export function NavigationButtons({ step, setStep }: NavigationButtonsProps) {
    return (
        <div className="flex items-center space-x-4">
            <Button disabled={step === 1} type="button" onClick={() => setStep(step - 1)}>Back</Button>
            <Button type="submit">{step === 2 ? "Submit" : "Next"}</Button>
        </div>
    );
}