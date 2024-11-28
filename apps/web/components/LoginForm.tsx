"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@repo/ui/shad";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Icons } from "./Icons";
import { TogglePasswordVisibility } from "./TogglePasswordVisibility";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [requiredError, setRequiredError] = useState({
    emailReq: false,
    passReq: false,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      setRequiredError({
        emailReq: email ? false : true,
        passReq: password ? false : true,
      });
      return;
    }
    const loadId = toast.loading("Signing in...");
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    toast.dismiss(loadId);
    if (!res?.error) {
      window.location.assign("/");
      toast.success("Signed In");
    } else {
      if (res.status === 401) {
        toast.error("Invalid Credentials, Try again!");
      } else if (res.status === 400) {
        toast.error("Missing Credentials!");
      } else if (res.status === 404) {
        toast.error("Account not found!");
      } else if (res.status === 403) {
        toast.error("Forbidden!");
      } else {
        toast.error("oops something went wrong..!");
      }
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    setRequiredError((prevState) => ({
      ...prevState,
      emailReq: false,
    }));
  }
  return (
    <Card className="mx-auto w-full md:w-3/12 space-y-4">
      <CardHeader>
        <CardTitle className="text-2xl text-center underline">Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              id="email"
              type="text"
              placeholder="m@example.com"
            />
            {requiredError.emailReq && (
              <span className="text-destructive text-sm">
                Email is required
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                value={password}
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                onChange={(e) => {
                  setRequiredError((prevState) => ({
                    ...prevState,
                    passReq: false,
                  }));
                  setPassword(e.target.value);
                }}
              />
              <TogglePasswordVisibility
                isPasswordVisible={isPasswordVisible}
                setIsPasswordVisible={setIsPasswordVisible}
              />
            </div>
            {requiredError.passReq && (
              <span className="text-destructive text-sm">
                Password is required
              </span>
            )}
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <Button
          onClick={async () => {
            await signIn("google");
          }}
          variant="outline"
          className="w-full"
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Login with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
      <Toaster />
    </Card>
  );
}
