"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Camera, ImageIcon, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StudentProfile } from "../_actions/profileActions";
import { updateMyStudentProfileAction } from "../_actions/profileActions";

const dateValue = (value?: string | null) => (value ? value.slice(0, 10) : "");

export default function StudentProfileForm({ profile }: { profile: StudentProfile }) {
  const [state, formAction, isSubmitting] = useActionState(updateMyStudentProfileAction, null);
  const [isPending, startTransition] = useTransition();
  const [gender, setGender] = useState(profile.gender ?? "");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

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

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  const busy = isSubmitting || isPending;
  const updatedImageUrl =
    state?.success && state.data
      ? "studentProfile" in state.data
        ? state.data.studentProfile?.user?.imageUrl
        : state.data.user?.imageUrl
      : undefined;
  const imageUrl = updatedImageUrl || profile.user?.imageUrl || "";
  const previewImageUrl = state?.success ? "" : selectedImageUrl;

  return (
    <form ref={formRef} onSubmit={submit} className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Student profile</CardTitle>
          <CardDescription>Update your personal information. Academic details are managed by the university.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
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
                      alt="Student profile"
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
              <div className="mt-4 w-full max-w-md space-y-2">
                {/* <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">
                  Current image URL
                </Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  placeholder="No profile image uploaded"
                  readOnly
                  className="text-xs"
                /> */}
              </div>
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={profile.user?.name ?? ""} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.user?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input value={profile.department?.name ? `${profile.department.name}${profile.department.code ? ` (${profile.department.code})` : ""}` : ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Program</Label>
            <Input value={profile.program?.name ? `${profile.program.name}${profile.program.code ? ` (${profile.program.code})` : ""}` : ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={dateValue(profile.dateOfBirth)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <input type="hidden" name="gender" value={gender} />
            <Select value={gender} onValueChange={(value) => setGender(value ?? "")}>
              <SelectTrigger id="gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={profile.address ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName">Emergency contact name</Label>
            <Input id="emergencyContactName" name="emergencyContactName" defaultValue={profile.emergencyContactName ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone">Emergency contact phone</Label>
            <Input id="emergencyContactPhone" name="emergencyContactPhone" defaultValue={profile.emergencyContactPhone ?? ""} />
          </div>
        </CardContent>
      </Card>
      <Button type="submit" disabled={busy} className="w-fit">
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Save profile
      </Button>
    </form>
  );
}
