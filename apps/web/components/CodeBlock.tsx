interface CodeBlockProps {
  title: string;
  content: string | null;
}

export function CodeBlock({ title, content }: CodeBlockProps) {
  return (
    <div className="flex flex-col gap-y-1">
      <div className="text-sm">{title}</div>
      <code className="py-2 px-4 bg-secondary">{content}</code>
    </div>
  );
}
