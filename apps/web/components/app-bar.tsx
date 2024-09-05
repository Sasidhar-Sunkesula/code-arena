"use client";
import { Button } from "@repo/ui";
import { signIn, signOut } from "next-auth/react"

export const Appbar = () => {
    return <div>
        <Button onClick={() => signIn()}>Signin</Button>
        <Button onClick={() => signOut()}>Sign out</Button>
    </div>
}