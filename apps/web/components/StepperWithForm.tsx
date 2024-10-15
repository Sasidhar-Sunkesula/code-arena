"use client"

import { ContributionForm } from "@/components/ContributionForm";
import { Stepper } from "@/components/Stepper";
import { useState } from "react";
import { ConfirmationTest } from "./ConfirmationTest";
import { Language } from "./CodeEditor";
import toast, { Toaster } from "react-hot-toast";

export interface BoilerplateCodes {
    [language: string]: string;
}

export function StepperWithForm() {
    const [step, setStep] = useState(1);
    const [createdProblemId, setCreatedProblemId] = useState<number | null>(null);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [boilerplateCodes, setBoilerplateCodes] = useState<BoilerplateCodes>({});
    return (
        <div className="flex w-full gap-x-14 justify-between items-center">
            <Stepper step={step} />
            <Toaster />
            <div className="flex-grow max-w-7xl">
                {step < 4
                    ? <ContributionForm
                        boilerplateCodes={boilerplateCodes}
                        setBoilerplateCodes={setBoilerplateCodes}
                        step={step}
                        setCreatedProblemId={setCreatedProblemId}
                        languages={languages}
                        setLanguages={setLanguages}
                        setStep={setStep}
                    />
                    : createdProblemId
                        ? (
                            <ConfirmationTest
                                createdProblemId={createdProblemId}
                                languages={languages}
                                boilerplateCodes={boilerplateCodes}
                            />
                        )
                        : toast.error("Created Problem Id not found, cannot test the contribution")
                }
            </div>
        </div>
    )
}