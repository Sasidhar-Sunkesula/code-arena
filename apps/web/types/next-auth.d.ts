import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
        id: string;
        email: string;
        userName: string;
        fullName: string | null;
        image: string | null;
    }

    interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        id: string;
        email: string;
        userName: string;
        fullName: string | null;
        image: string | null;
    }
}