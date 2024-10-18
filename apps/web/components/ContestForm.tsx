"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button, Form } from "@repo/ui/shad"
import { UserDetailsForm } from "./UserDetailsForm"
import { contestFormSchema } from "@repo/common/zod"
import { DifficultyLevel } from "@repo/common/types"
import toast, { Toaster } from "react-hot-toast"
import { ContestRangeForm } from "./ContestRangeForm"

export function ContestForm() {

    const form = useForm<z.infer<typeof contestFormSchema>>({
        resolver: zodResolver(contestFormSchema),
        defaultValues: {
            userName: '',
            contestName: '',
            difficultyLevel: DifficultyLevel.EASY,
            startsOn: new Date(),
            endsOn: new Date()
        },
    });

    async function onSubmit(values: z.infer<typeof contestFormSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-12">
                    <UserDetailsForm
                        control={form.control}
                        labels={{
                            userName: "Your Name",
                            problemName: "Contest Name",
                            difficultyLevel: "Difficulty Level"
                        }}
                        descriptions={{
                            userName: "This will be visible as contributed by when people look at your contest.",
                            problemName: "This will be visible as the contest name. Max characters are 50.",
                            difficultyLevel: "Select the difficulty level of the contest."
                        }}
                        placeholders={{
                            userName: "Ratan Tata",
                            problemName: "Basic Booster"
                        }}
                    />
                    <ContestRangeForm
                        control={form.control}
                        watch={form.watch}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
            <Toaster />
        </Form>
    );
}