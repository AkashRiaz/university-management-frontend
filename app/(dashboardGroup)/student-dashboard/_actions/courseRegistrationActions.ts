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

const getAccessToken = async () => {
  const accessToken = await isAccessTokenExist();
  if (!accessToken) return { success: false as const, message: "Access token not found", statusCode: 401 };
  return { success: true as const, accessToken };
};

const fetchCourseRegistrationData = async (
  path: string,
  init: RequestInit = {},
): Promise<CourseRegistrationResponse> => {
  try {
    const auth = await getAccessToken();
    if (!auth.success) return auth;

    const response = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${auth.accessToken}`,
        ...init.headers,
      },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return { success: false, message: result?.message || "Failed to fetch course registration data", statusCode: response.status, data: null };
    }

    return { success: true, message: result.message || "Course registration data fetched successfully", statusCode: response.status, data: result.data ?? null };
  } catch (error) {
    console.error(`Error fetching course registration data from ${path}:`, error);
    return { success: false, message: "Something went wrong while fetching course registration data.", statusCode: 500, data: null };
  }
};

export const getAvailableCoursesAction = async (registrationId: string) =>
  fetchCourseRegistrationData(`/course-registrations/${registrationId}/available-courses`);

export const getCourseRegistrationsAction = async (registrationId: string) =>
  fetchCourseRegistrationData(`/course-registrations/registration/${registrationId}`);

export const addCourseRegistrationAction = async (registrationId: string, sectionId: string) => {
  const result = await fetchCourseRegistrationData("/course-registrations", {
    method: "POST",
    body: JSON.stringify({ registrationId, sectionId }),
  });
  if (result.success) revalidateTag("registrations", { expire: 0 });
  return result;
};

export const dropCourseRegistrationAction = async (courseRegistrationId: string) => {
  const result = await fetchCourseRegistrationData(`/course-registrations/${courseRegistrationId}/drop`, { method: "POST" });
  if (result.success) revalidateTag("registrations", { expire: 0 });
  return result;
};
