"use server";

import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";
import { UpdateStudentSelfZodSchema } from "@/components/validations/student.validation";

export type StudentProfile = {
  id: string;
  dateOfBirth?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER" | null;
  phone?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  department?: { name?: string | null; code?: string | null } | null;
  program?: { name?: string | null; code?: string | null } | null;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    imageUrl?: string | null;
  } | null;
};

export type StudentProfileResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: StudentProfile | { user?: StudentProfile["user"]; studentProfile?: StudentProfile } | null;
};

const getAccessToken = async () => {
  const accessToken = await isAccessTokenExist();
  if (!accessToken) {
    return {
      success: false as const,
      message: "Access token not found",
      statusCode: 401,
    };
  }
  return { success: true as const, accessToken };
};

export const getMyStudentProfileAction = async (): Promise<StudentProfileResponse> => {
  try {
    const auth = await getAccessToken();
    if (!auth.success) return auth;

    const response = await fetch(`${process.env.BACKEND_API_URL}/students/me`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to load student profile",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Student profile loaded successfully",
      statusCode: response.status,
      data: result.data ?? null,
    };
  } catch (error) {
    console.error("Student profile request failed:", error);
    return {
      success: false,
      message: "Something went wrong while loading your profile.",
      statusCode: 500,
    };
  }
};

export const updateMyStudentProfileAction = async (
  _previousState: StudentProfileResponse | null,
  formData: FormData,
): Promise<StudentProfileResponse> => {
  const payload = {
    name: formData.get("name") || undefined,
    dateOfBirth: formData.get("dateOfBirth") || undefined,
    gender: formData.get("gender") || undefined,
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
    emergencyContactName: formData.get("emergencyContactName") || undefined,
    emergencyContactPhone: formData.get("emergencyContactPhone") || undefined,
  };
  const validation = UpdateStudentSelfZodSchema.safeParse(payload);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Invalid profile information",
      statusCode: 400,
    };
  }

  try {
    const auth = await getAccessToken();
    if (!auth.success) return auth;

    const requestBody = new FormData();
    for (const [key, value] of Object.entries(validation.data)) {
      if (value !== undefined) {
        requestBody.append(
          key,
          value instanceof Date ? value.toISOString() : String(value),
        );
      }
    }

    const profileImage = formData.get("profileImage");
    if (profileImage instanceof File && profileImage.size > 0) {
      requestBody.append("profileImage", profileImage);
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/students/me`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${auth.accessToken}` },
      body: requestBody,
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to update student profile",
        statusCode: response.status,
      };
    }

    console.log("Student profile updated successfully:", result.data);

    revalidateTag("my-profile", { expire: 0 });
    return {
      success: true,
      message: result.message || "Your student profile updated successfully",
      statusCode: response.status,
      data: result.data ?? null,
    };
  } catch (error) {
    console.error("Student profile update failed:", error);
    return {
      success: false,
      message: "Something went wrong while updating your profile.",
      statusCode: 500,
    };
  }
};
