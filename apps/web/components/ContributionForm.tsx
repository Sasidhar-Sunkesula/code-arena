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

export interface BoilerplateCodes {
    [language: string]: string;
}
interface ContributionFormProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>
}
export function ContributionForm({ step, setStep }: ContributionFormProps) {
    const [description, setDescription] = useState("");
    const [boilerplateCodes, setBoilerplateCodes] = useState<BoilerplateCodes>({});
    const [languages, setLanguages] = useState<{ id: number; judge0Name: string }[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');

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
                }
            } catch (error) {
                console.error('Failed to fetch languages', error);
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

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
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
                <NavigationButtons step={step} setStep={setStep} />
            </form>
        </Form>
    );
}