"use server";

import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";
import type { IRegistration } from "@/types/registration.type";

type Query = Record<string, string | string[] | undefined>;

export type RegistrationResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IRegistration[] | IRegistration | null;
  meta?: { page: number; limit: number; total: number; totalPages: number } | null;
};

const getAccessToken = async () => {
  const accessToken = await isAccessTokenExist();
  if (!accessToken) return { success: false as const, message: "Access token not found", statusCode: 401 };
  return { success: true as const, accessToken };
};

const queryValue = (item: string | string[] | undefined) =>
  Array.isArray(item) ? item[0] || "" : item || "";

export const getMyRegistrationsAction = async (query: Query = {}): Promise<RegistrationResponse> => {
  try {
    const auth = await getAccessToken();
    if (!auth.success) return auth;

    const params = new URLSearchParams();
    for (const key of ["page", "limit", "sortBy", "sortOrder", "searchTerm", "semesterId", "status"]) {
      const item = queryValue(query[key]);
      if (item) params.set(key, item);
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/registrations/my-registrations${params.size ? `?${params}` : ""}`,
      { headers: { Authorization: `Bearer ${auth.accessToken}` }, cache: "no-store" },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) {
      return { success: false, message: result?.message || "Failed to fetch registrations", statusCode: response.status, data: null };
    }
    return { success: true, message: result.message || "Registrations fetched successfully", statusCode: response.status, data: result.data ?? null, meta: result.meta ?? null };
  } catch (error) {
    console.error("Error fetching student registrations:", error);
    return { success: false, message: "Something went wrong while fetching registrations.", statusCode: 500, data: null };
  }
};

export const createRegistrationAction = async (semesterId: string): Promise<RegistrationResponse> => {
  if (!semesterId) return { success: false, message: "Semester is required", statusCode: 400 };
  try {
    const auth = await getAccessToken();
    if (!auth.success) return auth;
    const response = await fetch(`${process.env.BACKEND_API_URL}/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.accessToken}` },
      body: JSON.stringify({ semesterId }),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) return { success: false, message: result?.message || "Failed to create registration", statusCode: response.status };
    revalidateTag("registrations", { expire: 0 });
    return { success: true, message: result.message || "Registration created successfully", statusCode: response.status, data: result.data ?? null };
  } catch (error) {
    console.error("Error creating registration:", error);
    return { success: false, message: "Something went wrong while creating the registration.", statusCode: 500 };
  }
};

export const submitRegistrationAction = async (registrationId: string): Promise<RegistrationResponse> => {
  if (!registrationId) return { success: false, message: "Registration ID is required", statusCode: 400 };
  try {
    const auth = await getAccessToken();
    if (!auth.success) return auth;
    const response = await fetch(`${process.env.BACKEND_API_URL}/registrations/${registrationId}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.accessToken}` },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) return { success: false, message: result?.message || "Failed to submit registration", statusCode: response.status };
    revalidateTag("registrations", { expire: 0 });
    return { success: true, message: result.message || "Registration submitted successfully", statusCode: response.status, data: result.data ?? null };
  } catch (error) {
    console.error("Error submitting registration:", error);
    return { success: false, message: "Something went wrong while submitting the registration.", statusCode: 500 };
  }
};
