import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@repo/ui/shad";
import rehypeSanitize from "rehype-sanitize";
import MDEditor from '@uiw/react-md-editor';
import { Control } from "react-hook-form";
import { ProblemFormType } from "@repo/common/types";

interface ProblemDescriptionFormProps {
    control: Control<ProblemFormType, any>;
}

export function ProblemDescriptionForm({ control }: ProblemDescriptionFormProps) {
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
                            value={field.value}
                            onChange={field.onChange}
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
    );
}