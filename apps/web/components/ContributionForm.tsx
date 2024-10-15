"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { Form } from "@repo/ui/shad"
import { UserDetailsForm } from "./UserDetailsForm"
import { ProblemDescriptionForm } from "./ProblemDescriptionForm"
import { BoilerplateCodeForm } from "./BoilerplateCodeForm"
import { NavigationButtons } from "./NavigationButtons"
import { TestCasesForm } from "./TestCasesForm"
import { formSchema } from "@repo/common/zod"
import { DifficultyLevel } from "@repo/common/types"
import { getLanguages } from "@/app/actions/getLanguages"
import toast, { Toaster } from "react-hot-toast"
import { BoilerplateCodes } from "./StepperWithForm"
import { Language } from "./CodeEditor"

interface ContributionFormProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    boilerplateCodes: BoilerplateCodes;
    languages: Language[];
    setCreatedProblemId: React.Dispatch<React.SetStateAction<number | null>>
    setLanguages: React.Dispatch<React.SetStateAction<Language[]>>
    setBoilerplateCodes: React.Dispatch<React.SetStateAction<BoilerplateCodes>>;
}
export function ContributionForm({
    step,
    languages,
    setStep,
    boilerplateCodes,
    setLanguages,
    setBoilerplateCodes
}: ContributionFormProps) {

    const [description, setDescription] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchLanguages() {
            try {
                const response = await getLanguages();
                if (response.languages) {
                    setLanguages(response.languages);
                    // Initialize boilerplateCodes with fetched languages
                    const initialBoilerplateCodes: BoilerplateCodes = {};
                    response.languages.forEach((language: { judge0Name: string }) => {
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
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

    async function onSubmit(values: z.infer<typeof formSchema>) {
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-10">
                        <UserDetailsForm control={form.control} />
                        <ProblemDescriptionForm control={form.control} description={description} setDescription={setDescription} />
                    </div>
                )}
                {step === 2 && (
                    <BoilerplateCodeForm
                        control={form.control}
                        selectedLanguage={selectedLanguage}
                        handleLanguageChange={handleLanguageChange}
                        boilerplateCodes={boilerplateCodes}
                        handleBoilerplateChange={handleBoilerplateChange}
                        languages={languages}
                    />
                )}
                {step === 3 && (
                    <TestCasesForm control={form.control} fields={fields} append={append} remove={remove} />
                )}
                <NavigationButtons loading={loading} step={step} setStep={setStep} />
            </form>
            <Toaster />
        </Form>
    );
}