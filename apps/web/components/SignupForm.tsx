"use client"

import Link from "next/link"

import { createUser } from "@/app/actions/createUser"
import {
    Button, Card,
    CardContent,
    CardHeader,
    CardTitle, Input, Label
} from "@repo/ui/shad"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Icons } from "./Icons"
import { TogglePasswordVisibility } from "./TogglePasswordVisibility"

export function SignUpForm() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [requiredError, setRequiredError] = useState({
        userNameReq: false,
        emailReq: false,
        passReq: false,
    });
    const router = useRouter();
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email || !password || !userName) {
            setRequiredError({
                userNameReq: userName ? false : true,
                emailReq: email ? false : true,
                passReq: password ? false : true,
            });
            setPasswordMismatch(false)
            return;
        } else if (password !== confirmPassword) {
            setPasswordMismatch(true);
            return;
        }
        const loadId = toast.loading('Signing Up...');
        try {
            const userResponse = await createUser(userName, email, password);
            if (userResponse.status !== 200) {
                throw new Error(userResponse.msg)
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to sign Up");
        }
        const res = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });
        toast.dismiss(loadId);
        if (!res) {
            toast.error('Error Signing Up');
        } else if (res && res.error) {
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
        } else if (res.ok && !res.error) {
            router.push("/");
            toast.success("Signed Up!")
        }
    }

    function handleEmailChange(value: string) {
        setEmail(value);
        setRequiredError(prevState => ({
            ...prevState,
            emailReq: false,
        }));
    }
    function handlePasswordChange(value: string) {
        setPassword(value);
        setRequiredError(prev => ({
            ...prev,
            passReq: false
        }))
    }
    function handleUserNameChange(value: string) {
        setUserName(value);
        setRequiredError(prev => ({
            ...prev,
            userNameReq: false
        }))
    }
    return (
        <Card className="mx-auto w-full md:w-3/12 space-y-4">
            <CardHeader>
                <CardTitle className="text-2xl text-center underline">Register</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            value={userName}
                            onChange={(e) => handleUserNameChange(e.target.value)}
                            id="username"
                            type="text"
                            placeholder="venky"
                        />
                        {requiredError.userNameReq && (
                            <span className="text-destructive text-sm">Username is required</span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            id="email"
                            type="text"
                            placeholder="venky@example.com"
                        />
                        {requiredError.emailReq && <span className="text-destructive text-sm">Email is required</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                value={password}
                                id="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                            />
                            <TogglePasswordVisibility
                                isPasswordVisible={isPasswordVisible}
                                setIsPasswordVisible={setIsPasswordVisible}
                            />
                        </div>
                        {requiredError.passReq && <span className="text-destructive text-sm">Password is required</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                value={confirmPassword}
                                id="confirm-password"
                                type={isConfirmPasswordVisible ? 'text' : 'password'}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <TogglePasswordVisibility
                                isPasswordVisible={isConfirmPasswordVisible}
                                setIsPasswordVisible={setIsConfirmPasswordVisible}
                            />
                        </div>
                        {passwordMismatch && <span className="text-destructive text-sm">Password did not match confirmed password</span>}
                    </div>
                    <Button type="submit" className="w-full">
                        Sign Up
                    </Button>
                </form>
                <Button onClick={async () => {
                    await signIn("google");
                }}
                    variant="outline" className="w-full">
                    <Icons.google className="mr-2 h-4 w-4" />
                    Sign up with Google
                </Button>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="underline">
                        Sign In
                    </Link>
                </div>
            </CardContent>
            <Toaster />
        </Card>
    )
}