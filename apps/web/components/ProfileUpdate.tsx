"use client"

import { updateProfile } from "@/app/actions/updateProfile";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from "@repo/ui/shad";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export function ProfileUpdate({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void; }) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!name.trim() || !location.trim()) {
            toast.error("Name or Country should not be empty!")
            return;
        }
        try {
            const data = await updateProfile(name, location);
            if (data.status === 201) {
                toast.success(data.msg);
                onOpenChange(false)
            } else {
                throw new Error(data.msg)
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to update profile")
        }
    }
    return (
        <>
            <Toaster />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update your profile</DialogTitle>
                        <DialogDescription>
                            Provide your additional details to start participating in the contests. You only need to do this for the first time.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">
                                    Name
                                </Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ratan Tata"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">
                                    Country
                                </Label>
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="India"
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}