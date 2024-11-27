"use client";

import {
    Avatar, AvatarFallback, AvatarImage, Button, DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger, ModeToggle
} from "@repo/ui/shad";
import { LogOut, Menu, User } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Icons } from "./Icons";
import { Logo } from "./Logo";
import { NavMenu } from "./NavMenu";

export default function AppBar({ session }: { session: Session | null }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    <Logo />
                    <div className="hidden md:block">
                        <NavMenu />
                    </div>
                    <div className="flex items-center space-x-4">
                        <ModeToggle />
                        {session && session.user
                            ? <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={session.user.image ?? ""} alt="profile-img" />
                                        <AvatarFallback>{session.user.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-44 space-y-1" align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={`/user/${session.user.userName}`} className="flex items-center gap-x-2 cursor-default">
                                            <User className="w-5" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`https://github.com/Sasidhar-Sunkesula/code-arena`} className="flex items-center gap-x-2 cursor-default">
                                            <Icons.gitHub className="w-5" />
                                            <span>GitHub</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        <LogOut className="w-5 mr-2" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            : <>
                                <Link href="/auth/signin">
                                    <Button>Sign In</Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button>Sign Up</Button>
                                </Link>
                            </>
                        }
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="h-6 w-6 text-primary" />
                        </Button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden px-2 pt-2 pb-4 flex justify-center">
                    <NavMenu />
                </div>
            )}
        </header>
    )
}
