"use client";

import { editorOptions } from "@/lib/utils";
import { Editor } from "@monaco-editor/react";
import { SubmissionType } from "@repo/common/types";
import { Label, Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/shad";
import { CheckCircle2, Loader2Icon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Language, SubmissionData, SubmissionPendingObj } from "./CodeEditor";
import { Boilerplate } from "./ProblemContributionForm";
import { ResultDisplay } from "./ResultDisplay";
import { SubmitCode } from "./SubmitCode";

interface ConfirmationTestProps {
  boilerplateCodes: Boilerplate[];
  languages: Language[];
  testCases: { input: string; expectedOutput: string }[];
  setAllDone: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ConfirmationTest({
  boilerplateCodes,
  testCases,
  languages,
  setAllDone,
}: ConfirmationTestProps) {
  const filteredBpc = useMemo(
    () =>
      boilerplateCodes.filter(
        (bpc) => bpc.callerCode.length > 50 && bpc.initialFunction.length > 20,
      ),
    [boilerplateCodes],
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    filteredBpc[0]?.judge0Name!,
  );
  const [code, setCode] = useState<string>(
    filteredBpc[0]?.initialFunction ?? "",
  );
  const [submissionPending, setSubmissionPending] =
    useState<SubmissionPendingObj>({ run: false, submit: false });
  const [submissionResults, setSubmissionResults] =
    useState<SubmissionData | null>(null);
  const [submitClicked, setSubmitClicked] = useState(false);
  const selectedLangInfo = languages.find(
    (lang) => lang.judge0Name === selectedLanguage,
  );
  const acceptedLanguagesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (submissionResults && submissionResults.status === "Accepted") {
      if (!acceptedLanguagesRef.current.has(selectedLanguage)) {
        acceptedLanguagesRef.current.add(selectedLanguage);
        if (acceptedLanguagesRef.current.size === filteredBpc.length) {
          setAllDone(true);
        }
      }
    }
  }, [submissionResults]);

  useEffect(() => {
    const selectedBpc = filteredBpc.find(
      (bpc) => bpc.judge0Name === selectedLanguage,
    );
    if (selectedBpc) {
      setCode(selectedBpc.initialFunction);
    }
  }, [selectedLanguage]);

  return (
    <div className="space-y-4">
      <Label>Select Language</Label>
      <Tabs
        defaultValue={selectedLanguage}
        className="space-y-3"
        onValueChange={(value) => setSelectedLanguage(value)}
      >
        <TabsList>
          {filteredBpc.map((bpc) => (
            <TabsTrigger key={bpc.judge0Name} value={bpc.judge0Name}>
              {bpc.judge0Name}
              {submissionResults &&
                submissionResults.status === "Accepted" &&
                submissionResults.languageId === selectedLangInfo?.id && (
                  <CheckCircle2 className="w-5 text-green-500" />
                )}
            </TabsTrigger>
          ))}
        </TabsList>
        {filteredBpc.map((bpc) => (
          <TabsContent
            key={bpc.judge0Name}
            value={bpc.judge0Name}
            className="space-y-10"
          >
            <div>
              <Label>Boilerplate Function</Label>
              <Editor
                height={"20vh"}
                language={selectedLangInfo?.monacoName}
                value={code}
                onChange={(value) => setCode(value ?? "")}
                theme="vs-dark"
                loading={<Loader2Icon className="w-5 animate-spin" />}
                options={editorOptions}
              />
              <p className="mt-2 text-sm text-gray-500">
                You should solve and test the problem with all the languages
                that you have submitted the boilerplate code.
              </p>
            </div>
            <div>
              <Label>Caller Code</Label>
              <Editor
                height={"30vh"}
                language={selectedLangInfo?.monacoName}
                value={bpc.callerCode}
                theme="vs-dark"
                loading={<Loader2Icon className="w-5 animate-spin" />}
                options={{
                  ...editorOptions,
                  readOnly: true,
                  readOnlyMessage: {
                    value: "To edit caller code please go back to step 2",
                    isTrusted: true,
                  },
                }}
              />
              <p className="mt-2 text-sm text-gray-500">
                To edit caller code please go back to step 2 and come back here.
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="space-y-2">
        {selectedLangInfo ? (
          <div className="flex justify-end">
            <SubmitCode
              text="Run"
              testCases={testCases}
              type={SubmissionType.RUN}
              languageId={selectedLangInfo.id}
              fullCode={`${code.trim()}\n${filteredBpc.find((bpc) => bpc.judge0Name === selectedLanguage)?.callerCode}`}
              submissionPending={submissionPending}
              setSubmissionPending={setSubmissionPending}
              setSubmissionResults={setSubmissionResults}
              setSubmitClicked={setSubmitClicked}
            />
          </div>
        ) : (
          toast.error("Language not found, problem cannot be submitted")
        )}
        {submitClicked && (
          <ResultDisplay
            submissionPending={submissionPending}
            submissionResults={submissionResults}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
}
