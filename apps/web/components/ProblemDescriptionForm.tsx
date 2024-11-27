import { ProblemFormType } from "@repo/common/types";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/shad";
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from "next-themes";
import { Control } from "react-hook-form";
import rehypeSanitize from "rehype-sanitize";

interface ProblemDescriptionFormProps {
    control: Control<ProblemFormType, any>;
}

export function ProblemDescriptionForm({ control }: ProblemDescriptionFormProps) {
    const { resolvedTheme } = useTheme();
    
    return (
        <FormField
            control={control}
            name="content"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Problem Description</FormLabel>
                    <ul className="px-4 text-sm list-disc space-y-2">
                        <li>This will be visible as the problem description.</li>
                        <li>This should be in Markdown format.</li>
                        <li>People will only see the rendered markdown.</li>
                        <li>The description should contain the problem description, constraints and sample inputs and outputs.</li>
                        <li>
                            <a target="_blank" className="text-blue-500 underline" href="https://www.markdownguide.org/basic-syntax/">
                                Click here to know more about markdown
                            </a>
                        </li>
                    </ul>
                    <div className="h-3"></div>
                    <FormControl>
                        <MDEditor
                            suppressHydrationWarning
                            value={field.value}
                            onChange={field.onChange}
                            previewOptions={{
                                rehypePlugins: [[rehypeSanitize]],
                            }}
                            textareaProps={{
                                placeholder: 'Please enter Markdown text',
                                maxLength: 2000
                            }}
                            height={300}
                            visibleDragbar={false}
                            data-color-mode={resolvedTheme === "system" ? "light" : (resolvedTheme as "light" || "dark")}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}