import { credentialSchema } from '@repo/common/zod';
import prisma from '@repo/db/client';
import bcrypt from "bcrypt";
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import { ZodError } from 'zod';

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
                    const existingUser = await prisma.user.findUnique({
                        where: {
                            email: validatedCredentials.email
                        }
                    });
                    if (existingUser) {
                        const passwordMatch = await bcrypt.compare(validatedCredentials.password, existingUser.password);
                        if (passwordMatch) {
                            return {
                                id: existingUser.id,
                                email: existingUser.email,
                                userName: existingUser.username,
                                fullName: existingUser.fullName,
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
        jwt: async ({ token }) => {
            if (token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: {
                        email: token.email
                    }
                })
                if (dbUser) {
                    token.id = dbUser.id;
                    token.email = dbUser.email;
                    token.userName = dbUser.username;
                    token.fullName = dbUser.fullName;
                    token.image = dbUser.image;
                }
            }
            return token;
        },
        session: ({ session, token }) => {
            if (session.user && token.id) {
                session.user.id = token.id as string;
                session.user.userName = token.userName as string;
                session.user.fullName = token.fullName as string;
                session.user.image = token.image as string | null
            }
            return session;
        }
    }, pages: {
        signIn: "/auth/signin",
    }
} satisfies NextAuthOptions;