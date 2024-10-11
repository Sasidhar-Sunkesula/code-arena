"use client"

import { z } from "zod"
import { Button } from "@repo/ui/shad"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/shad"
import { Input } from "@repo/ui/shad"
import rehypeSanitize from "rehype-sanitize";
import MDEditor from '@uiw/react-md-editor';

const formSchema = z.object({
    problemName: z.string()
        .min(3, { message: "Problem name must be at least 3 characters." })
        .max(50, { message: "Problem name must be at most 50 characters." }),
    userName: z.string()
        .min(3, { message: "User name must be at least 3 characters." })
        .max(50, { message: "User name must be at most 50 characters." }),
    content: z.string()
        .min(50, { message: "Content must be at least 50 characters." })
        .max(500, { message: "Content must be at most 750 characters." })
});

export function ContributionForm() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: "",
            problemName: "",
            content: ""
        },
    })

    // 2. Initialize state for Markdown editor.
    const [content, setContent] = useState("");

    // 3. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your name</FormLabel>
                                <FormControl>
                                    <Input className="w-full md:w-8/12" placeholder="Ratan Tata" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This will be visible as contributed by when people look at your problem.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="problemName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name of the problem</FormLabel>
                                <FormControl>
                                    <Input className="w-full md:w-8/12" placeholder="Two sum" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This will be visible as the problem name. Max characters are 50.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Problem Description</FormLabel>
                            <ul className="px-4 text-sm list-disc space-y-2">
                                <li>This will be visible as the problem description.</li>
                                <li>This should be in Markdown format.</li>
                                <li>People will only see the rendered markdown.</li>
                                <li>The description should contain the problem description and sample test cases.</li>
                                <li>Max characters are 750.</li>
                                <li>
                                    <a target="_blank" className="text-blue-500 underline" href="https://www.markdownguide.org/basic-syntax/">
                                        Click here to know more about markdown
                                    </a>
                                </li>
                            </ul>
                            <div className="h-3"></div>
                            <FormControl>
                                <MDEditor
                                    value={content}
                                    onChange={(value) => {
                                        setContent(value || "");
                                        field.onChange(value);
                                    }}
                                    previewOptions={{
                                        rehypePlugins: [[rehypeSanitize]],
                                    }}
                                    textareaProps={{
                                        placeholder: 'Please enter Markdown text',
                                        maxLength: 750
                                    }}
                                    height="100%"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Next</Button>
            </form>
        </Form>
    )
}