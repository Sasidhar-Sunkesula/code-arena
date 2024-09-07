"use client";

import Link from "next/link"
import { Button, ModeToggle } from "@repo/ui/shad"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@repo/ui/shad";
import { useState } from "react"
import { CodeXml, Menu } from "lucide-react";
import Image from "next/image";
export default function AppBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    <Link href="/" className="flex items-center space-x-2">
                        <CodeXml className="h-6 w-6" />
                        <span className="font-bold text-lg">NoCode</span>
                    </Link>

                    <nav className="hidden md:flex space-x-4">
                        <Button variant="ghost">Challenges</Button>
                        <Button variant="ghost">Leaderboard</Button>
                        <Button variant="ghost">Resources</Button>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <ModeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="h-10 w-10 flex justify-center border bg-secondary items-center rounded-full">
                                    <Image
                                        src="/placeholder.svg"
                                        alt="User"
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                <div className="md:hidden">
                    <nav className="px-2 pt-2 pb-4 space-y-1">
                        <Button variant="ghost" className="w-full justify-start">Challenges</Button>
                        <Button variant="ghost" className="w-full justify-start">Leaderboard</Button>
                        <Button variant="ghost" className="w-full justify-start">Resources</Button>
                    </nav>
                </div>
            )}
        </header>
    )
}