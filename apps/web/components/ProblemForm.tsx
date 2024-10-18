"use client"

import { ProblemContributionForm } from "@/components/ProblemContributionForm";
import { Stepper } from "@/components/Stepper";
import { useState } from "react";

export function ProblemForm() {
    const [step, setStep] = useState(1);
    return (
        <div className="flex w-full gap-x-14 justify-between items-center">
            <Stepper step={step} />
            <div className="flex-grow max-w-7xl">
                <ProblemContributionForm
                    step={step}
                    setStep={setStep}
                />
            </div>
        </div>
    )
}