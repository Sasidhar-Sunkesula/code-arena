"use client";

import { createDemo } from "@/app/actions/createDemo";
import { Button } from "@repo/ui/shad";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function DemoButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function handleClick() {
    try {
      setLoading(true);
      const response = await createDemo();
      if (response.msg) {
        throw new Error(response.msg);
      }
      router.push(
        `/solve/${response.problemId}?type=demo&tempId=${response.id}`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to start the demo",
      );
    }
  }
  return (
    <Button disabled={loading} onClick={handleClick} size="lg">
      {loading ? (
        <span className="flex items-center gap-x-2">
          Loading <Loader2 className="w-4 animate-spin" />
        </span>
      ) : (
        <span>Demo</span>
      )}
    </Button>
  );
}
