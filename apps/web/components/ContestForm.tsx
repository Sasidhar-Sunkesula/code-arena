"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button, Form } from "@repo/ui/shad"
import { contestFormSchema } from "@repo/common/zod"
import { ContestLevel } from "@repo/common/types"
import toast, { Toaster } from "react-hot-toast"
import { ContestRangeForm } from "./ContestRangeForm"
import { ContestBasicDetails } from "./ContestBasicDetails"
import { ContestProblemSelection } from "./ContestProblemSelection"
import { ContestSelectedProblems } from "./ContestSelectedProblems"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function ContestForm() {
    const [selectedProblems, setSelectedProblems] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof contestFormSchema>>({
        resolver: zodResolver(contestFormSchema),
        defaultValues: {
            userName: '',
            contestName: '',
            difficultyLevel: ContestLevel.BEGINNER,
            startsOn: new Date().toISOString(),
            endsOn: "",
            problemIds: []
        },
    });

    async function onSubmit(values: z.infer<typeof contestFormSchema>) {
        if (values.problemIds.length === 0) {
            form.setError("problemIds", {
                type: "required",
                message: "At least one problem must be selected",
            });
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contribute/contest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg)
            }
            toast.success("Contest created successfully! Thank you for your contribution")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred while creating the contest.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-6">
                    <ContestBasicDetails
                        control={form.control}
                    />
                    <ContestRangeForm
                        control={form.control}
                        watch={form.watch}
                    />
                    <div className="flex items-center justify-between">
                        <div className="w-full md:w-6/12">
                            <ContestProblemSelection
                                control={form.control}
                                setSelectedProblems={setSelectedProblems}
                            />
                        </div>
                        <div className="w-full md:w-4/12">
                            <ContestSelectedProblems
                                watch={form.watch}
                                setValue={form.setValue}
                                selectedProblems={selectedProblems}
                                setSelectedProblems={setSelectedProblems}
                            />
                        </div>
                    </div>
                </div>
                <Button disabled={loading} type="submit">
                    {loading
                        ? <Loader2 className="animate-spin w-4" />
                        : "Submit"
                    }
                </Button>
            </form>
            <Toaster />
        </Form>
    );
}