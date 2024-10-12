"use client"

import { ContributionForm } from "@/components/ContributionForm";
import { Stepper } from "@/components/Stepper";
import { useState } from "react";

export function StepperWithForm() {
    const [step, setStep] = useState(1);
    return (
        <div className="flex w-full gap-x-14 justify-between items-center">
            <Stepper step={step} />
            <div className="flex-grow max-w-7xl">
                <ContributionForm step={step} setStep={setStep} />
            </div>
        </div>
    )
}