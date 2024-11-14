import prisma from '@repo/db/client';
import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { ZodError } from 'zod';
import bcrypt from "bcrypt";
import { JWT } from 'next-auth/jwt';
import { credentialSchema } from '@repo/common/zod';

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            email: string;
            image?: string;
        }
    }
}
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'your email' },
                password: { label: 'Password', type: 'password', placeholder: 'your password' },
            },
            async authorize(credentials) {
                try {
                    const validatedCredentials = credentialSchema.parse(credentials);
                    const existingUser = await prisma.user.findFirst({
                        where: {
                            email: validatedCredentials.email
                        }
                    });
                    if (existingUser) {
                        const passwordMatch = await bcrypt.compare(validatedCredentials.password, existingUser.password);
                        if (passwordMatch) {
                            return {
                                id: existingUser.id,
                                username: existingUser.fullName,
                                email: existingUser.email,
                                image: existingUser.image
                            }
                        }
                        return null;
                    }
                    return null;
                } catch (error) {
                    if (error instanceof ZodError) {
                        console.log(error.errors)
                    } else {
                        console.log(error)
                    }
                    return null;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true, // Allows users to link multiple authentication methods to a single account.
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: ({ token }) => {
            // This function is for debugging and we can look at what is being encoded in jwt 
            // console.log(token)
            return token
        },
        session: ({ session, token }: { session: Session, token: JWT }) => {
            if (session && session.user) {
                session.user.id = token.sub ?? ""
            }
            return session;
        }
    }, pages: {
        signIn: "/auth/signin",
    }
}