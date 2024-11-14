"use client"

import Link from "next/link"

import { Button } from "@repo/ui/shad"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@repo/ui/shad"
import { Input } from "@repo/ui/shad"
import { Label } from "@repo/ui/shad"
import { Icons } from "./Icons"
import { useState } from "react"
import { signIn } from "next-auth/react"
import toast, { Toaster } from "react-hot-toast"
import { EyeIcon, EyeOffIcon } from "lucide-react"

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
        const loadId = toast.loading('Signing in...');
        if (!email || !password) {
            setRequiredError({
                emailReq: email ? false : true,
                passReq: password ? false : true,
            });
            toast.dismiss(loadId);
            return;
        }
        const res = await signIn("credentials", {
            email: email,
            password: password,
            redirect: true,
        });
        toast.dismiss(loadId);
        if (!res?.error) {
            toast.success('Signed In');
        } else {
            if (res.status === 401) {
                toast.error('Invalid Credentials, try again!');
            } else if (res.status === 400) {
                toast.error('Missing Credentials!');
            } else if (res.status === 404) {
                toast.error('Account not found!');
            } else if (res.status === 403) {
                toast.error('Forbidden!');
            } else {
                toast.error('oops something went wrong..!');
            }
        }
    }
    function togglePasswordVisibility() {
        setIsPasswordVisible(prev => !prev);
    }
    function handleEmailChange(value: string) {
        setEmail(value);
        setRequiredError(prevState => ({
            ...prevState,
            emailReq: false,
        }));
    }
    return (
        <Card className="mx-auto w-full md:w-3/12">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
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
                            <span className="text-destructive text-sm">Email is required</span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                value={password}
                                id="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                onChange={(e) => {
                                    setRequiredError(prevState => ({
                                        ...prevState,
                                        passReq: false,
                                    }));
                                    setPassword(e.target.value)
                                }}
                                onKeyDown={async (e) => {
                                    if (e.key === "Enter") {
                                        setIsPasswordVisible(false);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 flex h-10 items-center px-4 text-neutral-500"
                                onClick={togglePasswordVisibility}
                            >
                                {isPasswordVisible ? (
                                    <EyeIcon className="h-5 w-5" />
                                ) : (
                                    <EyeOffIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {requiredError.passReq && (
                            <span className="text-destructive text-sm">Password is required</span>
                        )}
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
                <Button onClick={async () => {
                    await signIn("google");
                }}
                    variant="outline" className="w-full">
                    <Icons.google className="mr-2 h-4 w-4" />
                    Login with Google
                </Button>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="#" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
            <Toaster />
        </Card>
    )
}