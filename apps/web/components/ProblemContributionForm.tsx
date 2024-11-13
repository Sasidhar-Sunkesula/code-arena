"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Form, Label } from "@repo/ui/shad";
import { ProblemBasicDetails } from "./ProblemBasicDetails";
import { ProblemDescriptionForm } from "./ProblemDescriptionForm";
import { BoilerplateCodeForm } from "./BoilerplateCodeForm";
import { NavigationButtons } from "./NavigationButtons";
import { TestCasesForm } from "./TestCasesForm";
import { problemFormSchema } from "@repo/common/zod";
import { DifficultyLevel } from "@repo/common/types";
import toast, { Toaster } from "react-hot-toast";
import { ConfirmationTest } from "./ConfirmationTest";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { getLanguages } from "@/app/actions/getLanguages";
import { Language } from "./CodeEditor";

interface ProblemContributionFormProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}
export interface Boilerplate {
    judge0Name: string;
    initialFunction: string;
    callerCode: string;
}
export function ProblemContributionForm({
    step,
    setStep,
}: ProblemContributionFormProps) {
    const [allDone, setAllDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [languages, setLanguages] = useState<Language[]>([]);

    useEffect(() => {
        async function fetchLanguages() {
            try {
                const response = await getLanguages();
                if (response.languages) {
                    setLanguages(response.languages);
                }
            } catch {
                toast.error("An unknown error has occurred while fetching languages");
            }
        }
        fetchLanguages();
    }, []);

    const form = useForm<z.infer<typeof problemFormSchema>>({
        resolver: zodResolver(problemFormSchema),
        defaultValues: {
            userName: '',
            problemName: '',
            content: '',
            boilerplateCodes: [],
            testCases: [
                { input: '', expectedOutput: '' },
                { input: '', expectedOutput: '' },
                { input: '', expectedOutput: '' },
                { input: '', expectedOutput: '' },
            ],
            difficultyLevel: DifficultyLevel.EASY,
        },
    });

    async function onSubmit(values: z.infer<typeof problemFormSchema>) {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contribute/problem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg);
            }
            toast.success("Problem added successfully. Thank you for your contribution!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred while adding the problem.");
        } finally {
            setLoading(false);
        }
    }

    // Retrieve the content value from the form state
    const content = form.watch("content");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-10">
                        <ProblemBasicDetails control={form.control} />
                        <ProblemDescriptionForm control={form.control} />
                    </div>
                )}
                {step === 2 && (
                    <div className="flex gap-x-4">
                        <BoilerplateCodeForm
                            control={form.control}
                            languages={languages}
                        />
                        <div>
                            <Label>Problem Description</Label>
                            <MarkdownRenderer content={content} />
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <TestCasesForm control={form.control} />
                )}
                {step === 4 && (
                    <ConfirmationTest
                        languages={languages}
                        boilerplateCodes={form.watch("boilerplateCodes")}
                        setAllDone={setAllDone}
                        testCases={form.watch("testCases")}
                    />
                )}
                <NavigationButtons
                    loading={loading}
                    step={step}
                    setStep={setStep}
                    trigger={form.trigger}
                    allDone={allDone}
                />
            </form>
            <Toaster />
        </Form>
    );
}