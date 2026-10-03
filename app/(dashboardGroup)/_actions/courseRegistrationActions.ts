"use server";

import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";
import { ICourseRegistration } from "@/types/registration.type";

export type CourseRegistrationResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: ICourseRegistration[] | ICourseRegistration | {
    courses: Array<{ course?: unknown; section?: unknown; id?: string }>;
    sections: ICourseRegistration["section"][];
    programSemesterNumber: number;
    semesterId: string;
  } | null;
};

const request = async (path: string, init: RequestInit = {}): Promise<CourseRegistrationResponse> => {
  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) return { success: false, message: "Access token not found", statusCode: 401 };
    const response = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) {
      return { success: false, message: result?.message || "Request failed", statusCode: response.status };
    }
    return { success: true, message: result.message || "Request completed successfully", statusCode: response.status, data: result.data ?? null };
  } catch (error) {
    console.error(`Course registration request failed for ${path}:`, error);
    return { success: false, message: "Something went wrong. Please try again.", statusCode: 500 };
  }
};

export const getAvailableCoursesAction = async (registrationId: string) =>
  request(`/course-registrations/${registrationId}/available-courses`);

export const getCourseRegistrationsAction = async (registrationId: string) =>
  request(`/course-registrations/registration/${registrationId}`);

export const addCourseRegistrationAction = async (registrationId: string, sectionId: string) => {
  const result = await request("/course-registrations", {
    method: "POST",
    body: JSON.stringify({ registrationId, sectionId }),
  });
  if (result.success) revalidateTag("registrations", { expire: 0 });
  return result;
};

export const dropCourseRegistrationAction = async (courseRegistrationId: string) => {
  const result = await request(`/course-registrations/${courseRegistrationId}/drop`, { method: "POST" });
  if (result.success) revalidateTag("registrations", { expire: 0 });
  return result;
};
