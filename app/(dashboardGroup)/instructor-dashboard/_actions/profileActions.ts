"use server";

import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";

export type InstructorProfileActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: InstructorProfile | { user?: InstructorProfile["user"]; instructorProfile?: InstructorProfile } | null;
};

export type InstructorProfile = {
  id: string;
  specialization?: string | null;
  phone?: string | null;
  officeRoom?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  bio?: string | null;
  qualification?: string | null;
  designation?: string | null;
  joiningDate?: string | null;
  status?: string | null;
  department?: { id?: string; name?: string; code?: string } | null;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    imageUrl?: string | null;
  } | null;
};

export const getMyInstructorProfileAction = async () =>
  fetchInstructorProfile();

const fetchInstructorProfile = async (): Promise<InstructorProfileActionState> => {
  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return { success: false, message: "Access token not found", statusCode: 401, data: null };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/instructors/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch instructor profile",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: result.message || "Instructor profile fetched successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error fetching instructor profile:", error);
    return {
      success: false,
      message: "An error occurred while fetching the instructor profile",
      statusCode: 500,
      data: null,
    };
  }
};

export const updateMyInstructorProfileAction = async (
  _previousState: InstructorProfileActionState | null,
  formData: FormData,
) : Promise<InstructorProfileActionState> => {
  const requestBody = new FormData();
  for (const key of [
    "name",
    "specialization",
    "phone",
    "officeRoom",
    "dateOfBirth",
    "gender",
    "address",
    "bio",
    "qualification",
  ]) {
    const value = formData.get(key);
    if (typeof value === "string" && value.trim()) {
      requestBody.append(key, value);
    }
  }

  const image = formData.get("profileImage");
  if (image instanceof File && image.size > 0) {
    requestBody.append("profileImage", image);
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return { success: false, message: "Access token not found", statusCode: 401, data: null };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/instructors/me`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: requestBody,
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to update instructor profile",
        statusCode: response.status,
        data: null,
      };
    }

    revalidateTag("instructor-profile", { expire: 0 });
    return {
      success: true,
      message: result.message || "Instructor profile updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating instructor profile:", error);
    return {
      success: false,
      message: "Something went wrong while updating your profile.",
      statusCode: 500,
      data: null,
    };
  }
};
