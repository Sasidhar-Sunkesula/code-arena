"use client";

import { editProfile } from "@/app/actions/editProfile";
import { Button, Input, Label } from "@repo/ui/shad";
import {
  CalendarCheck2,
  Check,
  CloudUpload,
  MapPin,
  Signature,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export function UserDetails({
  id,
  createdAt,
  username,
  fullName,
  image,
  location,
}: {
  id: string;
  createdAt: Date;
  username: string;
  fullName: string | null;
  image: string | null;
  location: string | null;
}) {
  const session = useSession();
  const [userDetails, setUserDetails] = useState({
    username,
    fullName,
    location,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [renderEdit, setRenderEdit] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(image);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const loadToast = toast.loading("Updating Profile");
      const updateResponse = await editProfile(id, userDetails);
      if (updateResponse.status !== 204) {
        toast.dismiss(loadToast);
        throw new Error(updateResponse.msg);
      }
      toast.dismiss(loadToast);
      toast.success(updateResponse.msg);
      setRenderEdit(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update the profile",
      );
    }
  }

  async function handleImageUpload() {
    if (!profileImage) {
      return;
    }
    const formData = new FormData();
    formData.append("userId", id);
    formData.append("file", profileImage);
    try {
      const loadToast = toast.loading("Uploading file");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload-profile-pic`,
        {
          method: "POST",
          body: formData,
        },
      );
      const result = await response.json();
      toast.dismiss(loadToast);
      if (!response.ok) {
        toast.dismiss(loadToast);
        throw new Error(result.error || "Error uploading file");
      }
      toast.dismiss(loadToast);
      setImageUrl(result.secure_url);
      setProfileImage(null);
      toast.success(result.msg || "File uploaded successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload profile picture",
      );
    }
  }
  const canEdit = session.data?.user && session.data.user.id === id;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImageUrl(URL.createObjectURL(file));
    } else {
      setProfileImage(null);
    }
  };
  return (
    <div className="flex flex-col items-center gap-y-2 border py-4 rounded-sm shadow-sm">
      <div className="relative">
        <Image
          src={
            imageUrl ??
            "https://res.cloudinary.com/no-code/image/upload/v1732130579/dummy.png"
          }
          alt="profile-img"
          width={180}
          height={180}
          className="rounded-full object-cover w-44 h-44"
        />
        {canEdit && (
          <>
            {profileImage ? (
              <Button
                onClick={handleImageUpload}
                className="rounded-full bg-green-500 hover:bg-green-500 absolute right-0 bottom-1"
                size={"icon"}
              >
                <Check className="w-5 text-primary-foreground" />
              </Button>
            ) : (
              <Label
                htmlFor="profile"
                className="rounded-full absolute right-0 bottom-1 cursor-pointer bg-secondary p-3"
              >
                <CloudUpload className="w-4 h-4" />
              </Label>
            )}
            <Input
              onChange={handleFileChange}
              type="file"
              id="profile"
              className="hidden"
            />
          </>
        )}
      </div>
      {!canEdit || !renderEdit ? (
        <div className="grid grid-cols-2 px-2 gap-y-2 gap-x-6 justify-between md:w-10/12 mx-auto items-center">
          <div className="col-span-1 flex items-center gap-x-1">
            <User className="w-4" />
            <Label>Name</Label>
          </div>
          <div className="text-sm text-nowrap col-span-1">
            {userDetails.fullName}
          </div>

          <div className="col-span-1 flex items-center gap-x-1">
            <Signature className="w-4" />
            <Label className="col-span-1">Username</Label>
          </div>
          <div className="text-sm col-span-1">{userDetails.username}</div>

          <div className="col-span-1 flex items-center gap-x-1">
            <MapPin className="w-4" />
            <Label className="col-span-1">Country</Label>
          </div>
          <div className="text-sm col-span-1">
            {userDetails.location ?? "NA"}
          </div>

          <div className="col-span-1 flex items-center gap-x-1">
            <CalendarCheck2 className="w-4" />
            <Label className="col-span-1">Joined</Label>
          </div>
          <div className="text-sm col-span-1" suppressHydrationWarning>
            {createdAt.toLocaleDateString()}
          </div>

          {canEdit && (
            <div className="col-span-2 flex justify-center mt-2">
              <Button onClick={() => setRenderEdit(true)} size={"sm"}>
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input
              value={userDetails.fullName ?? ""}
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input
              value={userDetails.username}
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={userDetails.location ?? ""}
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-center gap-x-5">
            <Button type="submit">Submit</Button>
            <Button onClick={() => setRenderEdit(false)} type="button">
              Cancel
            </Button>
          </div>
        </form>
      )}
      <Toaster />
    </div>
  );
}
