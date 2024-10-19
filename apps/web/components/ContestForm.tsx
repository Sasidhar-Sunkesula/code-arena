"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button, Form } from "@repo/ui/shad"
import { contestFormSchema } from "@repo/common/zod"
import { ContestLevel } from "@repo/common/types"
import { Toaster } from "react-hot-toast"
import { ContestRangeForm } from "./ContestRangeForm"
import { ContestBasicDetails } from "./ContestBasicDetails"
import { ContestProblemSelection } from "./ContestProblemSelection"

export function ContestForm() {

    const form = useForm<z.infer<typeof contestFormSchema>>({
        resolver: zodResolver(contestFormSchema),
        defaultValues: {
            userName: '',
            contestName: '',
            difficultyLevel: ContestLevel.BEGINNER,
            startsOn: new Date(),
            endsOn: new Date(),
            problemIds: []
        },
    });

    async function onSubmit(values: z.infer<typeof contestFormSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-12">
                    <ContestBasicDetails
                        control={form.control}
                    />
                    <ContestRangeForm
                        control={form.control}
                        watch={form.watch}
                    />
                    <ContestProblemSelection
                        control={form.control}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
            <Toaster />
        </Form>
    );
}