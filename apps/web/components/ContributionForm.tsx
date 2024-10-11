"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Form } from "@repo/ui/shad"
import { UserDetailsForm } from "./UserDetailsForm"
import { ProblemDescriptionForm } from "./ProblemDescriptionForm"
import { BoilerplateCodeForm } from "./BoilerplateCodeForm"
import { NavigationButtons } from "./NavigationButtons"

const formSchema = z.object({
    problemName: z.string()
        .min(3, { message: "Problem name must be at least 3 characters." })
        .max(50, { message: "Problem name must be at most 50 characters." }),
    userName: z.string()
        .min(3, { message: "User name must be at least 3 characters." })
        .max(50, { message: "User name must be at most 50 characters." }),
    content: z.string()
        .min(50, { message: "Content must be at least 50 characters." })
        .max(750, { message: "Content must be at most 750 characters." }),
    boilerplateCodes: z.record(z.string()).optional()
});

export interface BoilerplateCodes {
    [language: string]: string;
}

export function ContributionForm() {
    const [step, setStep] = useState(1);
    const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
    const [description, setDescription] = useState("");
    const [boilerplateCodes, setBoilerplateCodes] = useState<BoilerplateCodes>({
        JavaScript: "",
        Python: "",
        Java: "",
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
            problemName: "",
            content: "",
            boilerplateCodes: boilerplateCodes
        },
    });

    function handleLanguageChange(language: string) {
        setSelectedLanguage(language);
    }

    function handleBoilerplateChange(value: string) {
        setBoilerplateCodes(prev => ({
            ...prev,
            [selectedLanguage]: value,
        }));
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                {step === 1 && (
                    <>
                        <UserDetailsForm control={form.control} />
                        <ProblemDescriptionForm control={form.control} description={description} setDescription={setDescription} />
                    </>
                )}
                {step === 2 && (
                    <BoilerplateCodeForm
                        control={form.control}
                        selectedLanguage={selectedLanguage}
                        handleLanguageChange={handleLanguageChange}
                        boilerplateCodes={boilerplateCodes}
                        handleBoilerplateChange={handleBoilerplateChange}
                    />
                )}
                <NavigationButtons step={step} setStep={setStep} />
            </form>
        </Form>
    );
}