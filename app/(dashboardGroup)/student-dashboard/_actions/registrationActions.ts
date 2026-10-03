"use server";

import { isAccessTokenExist } from "@/service/refreshToken";
import type { RegistrationResponse } from "../../_actions/registrationActions";

type Query = Record<string, string | string[] | undefined>;

const value = (item: string | string[] | undefined) =>
  Array.isArray(item) ? item[0] || "" : item || "";

export const getMyRegistrationsAction = async (
  query: Query = {},
): Promise<RegistrationResponse> => {
  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };
    }

    const params = new URLSearchParams();
    for (const key of [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "searchTerm",
      "semesterId",
      "status",
    ]) {
      const item = value(query[key]);
      if (item) params.set(key, item);
    }

    const path = `/registrations/my-registrations${params.size ? `?${params}` : ""}`;
    const response = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
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
    console.error("Student registrations request failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      statusCode: 500,
    };
  }
};
