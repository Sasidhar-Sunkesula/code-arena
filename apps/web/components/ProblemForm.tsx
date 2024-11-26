"use client"

import { ProblemContributionForm } from "@/components/ProblemContributionForm";
import { Stepper } from "@/components/Stepper";
import { useState } from "react";

export function ProblemForm() {
    const [step, setStep] = useState(1);
    return (
        <div className="w-full gap-8 flex flex-col md:flex-row">
            <div className="flex-shrink-0 md:h-[70vh] mt-16 my-auto flex flex-col justify-center">
                <Stepper step={step} />
            </div>
            <div className="px-1 flex-grow overflow-y-auto" style={{ height: "calc(100vh - 8rem)", scrollbarWidth: "thin" }}>
                <ProblemContributionForm
                    step={step}
                    setStep={setStep}
                />
            </div>
        </div>
    )
}