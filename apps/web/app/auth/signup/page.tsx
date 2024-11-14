import { SignUpForm } from "@/components/SignupForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignUp() {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        redirect('/');
    }
    return (
        <div style={{ height: "calc(100vh - 3.5rem)" }} className="flex border h-screen w-full items-center justify-center px-4">
            <SignUpForm />
        </div>
    )
}