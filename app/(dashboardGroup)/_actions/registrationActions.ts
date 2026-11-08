"use server";

import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IRegistration } from "@/types/registration.type";

type Query = Record<string, string | string[] | undefined>;

const value = (item: string | string[] | undefined) =>
  Array.isArray(item) ? item[0] || "" : item || "";

export type RegistrationResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IRegistration[] | IRegistration | null;
  meta?: { page: number; limit: number; total: number; totalPages: number } | null;
};

const request = async (
  path: string,
  init: RequestInit = {},
): Promise<RegistrationResponse> => {
  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return { success: false, message: "Access token not found", statusCode: 401 };
    }

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
      return {
        success: false,
        message: result?.message || "Request failed",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Request completed successfully",
      statusCode: response.status,
      data: result.data ?? null,
      meta: result.meta ?? null,
    };
  } catch (error) {
    console.error(`Registration request failed for ${path}:`, error);
    return { success: false, message: "Something went wrong. Please try again.", statusCode: 500 };
  }
};

export const createRegistrationAction = async (
  semesterId: string,
): Promise<RegistrationResponse> => {
  if (!semesterId) return { success: false, message: "Semester is required", statusCode: 400 };
  const result = await request("/registrations", {
    method: "POST",
    body: JSON.stringify({ semesterId }),
  });
  if (result.success) revalidateTag("registrations", { expire: 0 });
  return result;
};

export const getAllRegistrationsAction = async (
  query: Query = {},
): Promise<RegistrationResponse> => {
  const params = new URLSearchParams();
  for (const key of ["page", "limit", "sortBy", "sortOrder", "searchTerm", "studentId", "status"]) {
    const item = value(query[key]);
    if (item) params.set(key, item);
  }
  return request(`/registrations${params.size ? `?${params}` : ""}`);
};

export const getRegistrationAction = async (registrationId: string) =>
  request(`/registrations/${registrationId}`);

export const submitRegistrationAction = async (registrationId: string) => {
  const result = await request(`/registrations/${registrationId}/submit`, { method: "POST" });
  if (result.success) revalidateTag("registrations", { expire: 0 });
  return result;
};

export const approveRegistrationAction = async (registrationId: string) => {
  const result = await request(`/registrations/${registrationId}/approve`, { method: "POST" });
  if (result.success) revalidateTag("registrations", { expire: 0 });
  return result;
};

export const rejectRegistrationAction = async (registrationId: string) => {
  const result = await request(`/registrations/${registrationId}/reject`, { method: "POST" });
  if (result.success) revalidateTag("registrations", { expire: 0 });
  return result;
};
