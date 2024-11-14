import LoginForm from "@/components/LoginForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        redirect('/');
    }
    return (
        <div style={{ height: "calc(100vh - 3.5rem)" }} className="flex border h-screen w-full items-center justify-center px-4">
            <LoginForm />
        </div>
    )
}