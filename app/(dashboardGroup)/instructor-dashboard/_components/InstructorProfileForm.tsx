"use client";

import { useActionState, useEffect, useState } from "react";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateMyInstructorProfileAction, type InstructorProfile } from "../_actions/profileActions";

export default function InstructorProfileForm({ profile }: { profile: InstructorProfile }) {
  const [state, action, pending] = useActionState(updateMyInstructorProfileAction, null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    }
    if (state && !state.success) toast.error(state.message);
  }, [state]);

  useEffect(() => {
    return () => {
      if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl);
    };
  }, [selectedImageUrl]);

  const updatedImageUrl =
    state?.success && state.data
      ? "instructorProfile" in state.data
        ? state.data.instructorProfile?.user?.imageUrl
        : state.data.user?.imageUrl
      : undefined;
  const imageUrl = updatedImageUrl || profile.user?.imageUrl || "";
  const previewImageUrl = state?.success ? "" : selectedImageUrl;

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-6">
      <div><h1 className="text-2xl font-semibold">Instructor profile</h1><p className="text-sm text-muted-foreground">Update your teaching profile and contact details.</p></div>
      <div className="rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Profile photo</Label>
            <div className="flex flex-col items-center rounded-xl border bg-muted/20 px-4 py-6">
              <div className="relative">
                <label
                  htmlFor="profileImage"
                  className="group block size-32 cursor-pointer overflow-hidden rounded-full border-4 border-background bg-muted shadow-md ring-1 ring-border"
                >
                  {previewImageUrl || imageUrl ? (
                    <img
                      src={previewImageUrl || imageUrl}
                      alt="Instructor profile"
                      className="size-full object-cover transition group-hover:brightness-75"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center transition group-hover:bg-muted/80">
                      <ImageIcon className="size-10 text-muted-foreground" />
                    </div>
                  )}
                </label>
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/80"
                  aria-label="Change profile photo"
                >
                  <Camera className="size-4" />
                </label>
                <Input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setSelectedImageUrl((current) => {
                      if (current) URL.revokeObjectURL(current);
                      return file ? URL.createObjectURL(file) : "";
                    });
                  }}
                />
              </div>
              <p className="mt-3 text-sm font-medium">
                {previewImageUrl ? "New photo selected" : "Update profile photo"}
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Click the camera button to choose a new photo, then save your profile.
              </p>
              <p className="mt-4 max-w-md truncate text-center text-xs text-muted-foreground">
                {imageUrl || "No profile image uploaded"}
              </p>
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={profile.user?.name || ""} required /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={profile.user?.email || ""} disabled /></div>
          <div className="space-y-2"><Label>Designation</Label><Input value={profile.designation || ""} disabled /></div>
          <div className="space-y-2"><Label htmlFor="specialization">Specialization</Label><Input id="specialization" name="specialization" defaultValue={profile.specialization || ""} /></div>
          <div className="space-y-2"><Label htmlFor="qualification">Qualification</Label><Input id="qualification" name="qualification" defaultValue={profile.qualification || ""} /></div>
          <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" defaultValue={profile.phone || ""} /></div>
          <div className="space-y-2"><Label htmlFor="officeRoom">Office room</Label><Input id="officeRoom" name="officeRoom" defaultValue={profile.officeRoom || ""} /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="address">Address</Label><Input id="address" name="address" defaultValue={profile.address || ""} /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" name="bio" defaultValue={profile.bio || ""} /></div>
        </div>
        <Button className="mt-5" type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : null}
          {pending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
