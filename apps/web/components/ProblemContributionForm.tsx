"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { Form, Label } from "@repo/ui/shad"
import { ProblemBasicDetails } from "./ProblemBasicDetails"
import { ProblemDescriptionForm } from "./ProblemDescriptionForm"
import { BoilerplateCodeForm } from "./BoilerplateCodeForm"
import { NavigationButtons } from "./NavigationButtons"
import { TestCasesForm } from "./TestCasesForm"
import { problemFormSchema } from "@repo/common/zod"
import { DifficultyLevel } from "@repo/common/types"
import { getLanguages } from "@/app/actions/getLanguages"
import toast, { Toaster } from "react-hot-toast"
import { Language } from "./CodeEditor"
import { ConfirmationTest } from "./ConfirmationTest"
import { MarkdownRenderer } from "./MarkdownRenderer"

interface ProblemContributionFormProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}
export interface BoilerplateCodes {
    [language: string]: string;
}
export function ProblemContributionForm({
    step,
    setStep,
}: ProblemContributionFormProps) {
    const [allDone, setAllDone] = useState(false);
    const [description, setDescription] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [boilerplateCodes, setBoilerplateCodes] = useState<BoilerplateCodes>({});

    useEffect(() => {
        async function fetchLanguages() {
            try {
                const response = await getLanguages();
                if (response.languages) {
                    setLanguages(response.languages);
                    // Initialize boilerplateCodes with fetched languages
                    const initialBoilerplateCodes: BoilerplateCodes = {};
                    response.languages.map((language) => {
                        initialBoilerplateCodes[language.judge0Name] = '';
                    });
                    setBoilerplateCodes(initialBoilerplateCodes);
                } else if (response.msg) {
                    throw new Error(response.msg)
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "An unknown error has occured")
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
            boilerplateCodes: boilerplateCodes,
            testCases: [
                { input: '', expected_output: '' },
                { input: '', expected_output: '' },
                { input: '', expected_output: '' },
                { input: '', expected_output: '' },
            ],
            difficultyLevel: DifficultyLevel.EASY,
        },
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "testCases"
    });
    function handleLanguageChange(language: string) {
        setSelectedLanguage(language);
    }

    function handleBoilerplateChange(value: string) {
        if (selectedLanguage) {
            setBoilerplateCodes((prev) => ({
                ...prev,
                [selectedLanguage]: value,
            }));
        }
    }

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
            toast.success("Problem submitted successfully!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred while creating the problem.");
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
                        <ProblemBasicDetails
                            control={form.control}
                        />
                        <ProblemDescriptionForm control={form.control} description={description} setDescription={setDescription} />
                    </div>
                )}
                {step === 2 && (
                    <div className="flex gap-x-4">
                        <BoilerplateCodeForm
                            control={form.control}
                            selectedLanguage={selectedLanguage}
                            handleLanguageChange={handleLanguageChange}
                            boilerplateCodes={boilerplateCodes}
                            handleBoilerplateChange={handleBoilerplateChange}
                            languages={languages}
                        />
                        <div>
                            <Label>Problem Description</Label>
                            <MarkdownRenderer content={content} />
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <TestCasesForm control={form.control} fields={fields} append={append} remove={remove} />
                )}
                {step === 4 && (
                    <ConfirmationTest
                        languages={languages}
                        boilerplateCodes={boilerplateCodes}
                        setAllDone={setAllDone}
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
