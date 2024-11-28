"use client";

import { getLanguages } from "@/app/actions/getLanguages";
import { useSuccessRedirect } from "@/app/hooks/useSuccessRedirect";
import { zodResolver } from "@hookform/resolvers/zod";
import { DifficultyLevel } from "@repo/common/types";
import { problemFormSchema } from "@repo/common/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Form,
  Label,
} from "@repo/ui/shad";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { BoilerplateCodeForm } from "./BoilerplateCodeForm";
import { Language } from "./CodeEditor";
import { Confetti } from "./Confetti";
import { ConfirmationTest } from "./ConfirmationTest";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { NavigationButtons } from "./NavigationButtons";
import { ProblemBasicDetails } from "./ProblemBasicDetails";
import { ProblemDescriptionForm } from "./ProblemDescriptionForm";
import { TestCasesForm } from "./TestCasesForm";

interface ProblemContributionFormProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}
export interface Boilerplate {
  judge0Name: string;
  initialFunction: string;
  callerCode: string;
}
const LOCAL_STORAGE_KEY = "problemContribution";

export function ProblemContributionForm({
  step,
  setStep,
}: ProblemContributionFormProps) {
  const [allDone, setAllDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const session = useSession();
  const { success, setSuccess } = useSuccessRedirect("Problem");

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await getLanguages();
        if (response.languages) {
          setLanguages(response.languages);
        }
      } catch {
        toast.error("An unknown error has occurred while fetching languages");
      }
    }
    fetchLanguages();
  }, []);

  const form = useForm<z.infer<typeof problemFormSchema>>({
    resolver: zodResolver(problemFormSchema),
    defaultValues: {
      userName: session.data?.user.userName || "",
      problemName: "",
      content: "",
      boilerplateCodes: [],
      testCases: [
        { input: "", expectedOutput: "" },
        { input: "", expectedOutput: "" },
        { input: "", expectedOutput: "" },
        { input: "", expectedOutput: "" },
      ],
      difficultyLevel: DifficultyLevel.EASY,
    },
  });
  // Load saved form data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      setShowResumePrompt(true);
    }
  }, []);

  // Save form data to localStorage
  useEffect(() => {
    const subscription = form.watch((values) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleResume = () => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      form.reset(JSON.parse(savedData));
    }
    setShowResumePrompt(false);
  };

  const handleDiscard = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setShowResumePrompt(false);
  };

  async function onSubmit(values: z.infer<typeof problemFormSchema>) {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/contribute/problem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg);
      }
      setSuccess(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while adding the problem.",
      );
    } finally {
      setLoading(false);
    }
  }

  // Retrieve the content value from the form state
  const content = form.watch("content");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-10">
              <ProblemBasicDetails control={form.control} />
              <ProblemDescriptionForm control={form.control} />
            </div>
          )}
          {step === 2 && (
            <div className="gap-8 grid grid-cols-3 justify-between">
              <div className="col-span-2">
                <BoilerplateCodeForm
                  control={form.control}
                  languages={languages}
                />
              </div>
              <div
                className="md:h-[80vh] col-span-1 overflow-hidden hover:overflow-y-auto"
                style={{ scrollbarWidth: "thin" }}
              >
                <Label>Problem Description</Label>
                <MarkdownRenderer content={content} />
              </div>
            </div>
          )}
          {step === 3 && <TestCasesForm control={form.control} />}
          {step === 4 && (
            <ConfirmationTest
              languages={languages}
              boilerplateCodes={form.watch("boilerplateCodes")}
              setAllDone={setAllDone}
              testCases={form.watch("testCases")}
            />
          )}
          <NavigationButtons
            loading={loading}
            step={step}
            setStep={setStep}
            trigger={form.trigger}
            allDone={allDone}
            success={success}
          />
        </form>
      </Form>
      <Toaster />
      {success && <Confetti />}
      <AlertDialog open={showResumePrompt} onOpenChange={setShowResumePrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Previous Contribution</AlertDialogTitle>
            <AlertDialogDescription>
              You have a previous contribution saved. Would you like to resume
              it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscard}>
              Discard
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResume}>Resume</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
