"use client";

import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import rehypeSanitize from "rehype-sanitize";

export default function MarkdownEditor() {
  const [value, setValue] = useState<string>();

  return (
    <div>
      <MDEditor
        value={value}
        onChange={setValue}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        textareaProps={{
          placeholder: "Please enter Markdown text",
          maxLength: 100,
        }}
        minHeight={100}
      />
    </div>
  );
}
