import prisma from '@repo/db/client';
import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { z, ZodError } from 'zod';
import bcrypt from "bcrypt";
import { JWT } from 'next-auth/jwt';

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }
}
const credentialSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 8 characters long" })
})
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'text', placeholder: 'your email' },
                password: { label: 'password', type: 'password', placeholder: 'your password' },
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
                                name: existingUser.name,
                                email: existingUser.email
                            }
                        }
                        return null;
                    } else {
                        const salt = await bcrypt.genSalt(10);
                        const hash = await bcrypt.hash(validatedCredentials.password, salt);
                        const newUser = await prisma.user.create({
                            data: {
                                email: validatedCredentials.email,
                                password: hash,
                                name: ""
                            }
                        });
                        return {
                            id: newUser.id,
                            name: newUser.name,
                            email: newUser.email
                        }
                    }
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
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: ({ token }) => {
            // This function is for debugging and we can look at what is being encoded in jwt 
            console.log(token)
            return token
        },
        session: ({ session, token }: { session: Session, token: JWT }) => {
            if (session && session.user) {
            session.user.id = token.sub ?? ""
            }
            return session;
        }
    },
}