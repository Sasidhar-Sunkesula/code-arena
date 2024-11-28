import { editor } from "monaco-editor";

export function formatRunTime(runTime?: number | null) {
  return parseInt(((runTime ?? 0) * 1000).toFixed(2));
}
export function formatMemory(memory: number | null) {
  return parseFloat(((memory ?? 0) / 1024).toFixed(1));
}
export function getSuffix(type: "runTime" | "memory") {
  return type === "runTime" ? "ms" : "MB";
}
export const formatDateToIST = (date: Date) => {
  const optionsDate: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long", // full month name
    year: "numeric",
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const formattedDate = date.toLocaleDateString("en-IN", optionsDate);
  const formattedTime = date.toLocaleTimeString("en-IN", optionsTime);

  return `${formattedDate} ${formattedTime} IST`;
};
export const editorOptions = {
  minimap: { enabled: false },
  fontSize: 17,
  padding: {
    top: 6,
    bottom: 4,
  },
  smoothScrolling: true,
  lineNumbers: "on",
  cursorWidth: 3,
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  cursorBlinking: "expand",
  cursorSmoothCaretAnimation: "on",
  selectOnLineNumbers: true,
} satisfies editor.IStandaloneEditorConstructionOptions;
