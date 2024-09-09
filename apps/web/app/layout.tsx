import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "../components/Providers";
import NextTopLoader from "nextjs-toploader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AppBar from "@/components/AppBar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "NoCode",
  description: "Online Coding Practice Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextTopLoader color="#2E78C7" />
        <Providers>
          <div className="flex flex-col space-y-14">
            <AppBar session={session} />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
