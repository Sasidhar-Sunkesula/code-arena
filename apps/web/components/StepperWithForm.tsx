"use client"

import { ContributionForm } from "@/components/ContributionForm";
import { Stepper } from "@/components/Stepper";
import { useState } from "react";
import { ConfirmationTest } from "./ConfirmationTest";

export interface BoilerplateCodes {
    [language: string]: string;
}
export function StepperWithForm() {
    const [step, setStep] = useState(1);
    const [boilerplateCodes, setBoilerplateCodes] = useState<BoilerplateCodes>({});
    return (
        <div className="flex w-full gap-x-14 justify-between items-center">
            <Stepper step={step} />
            <div className="flex-grow max-w-7xl">
                {step < 4
                    ? <ContributionForm
                        boilerplateCodes={boilerplateCodes}
                        setBoilerplateCodes={setBoilerplateCodes}
                        step={step}
                        setStep={setStep}
                    />
                    :
                    <ConfirmationTest
                        boilerplateCodes={boilerplateCodes}
                    />
                }
            </div>
        </div>
    )
}