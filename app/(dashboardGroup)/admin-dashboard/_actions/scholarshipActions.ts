"use server";
import { revalidateTag } from "next/cache";

import { createScholarshipZodSchema } from "@/components/validations/scholarship.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IScholarship } from "@/types/scholarship.type";

type ScholarshipQuery = {
  [key: string]: string | string[] | undefined;
};

export type ScholarshipActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IScholarship | null;
};

export type ScholarshipResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IScholarship[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
};

const getScholarshipPayload = (formData: FormData) => ({
  name: formData.get("name"),
  type: formData.get("type"),
  percentage: formData.get("percentage")
    ? Number(formData.get("percentage"))
    : undefined,
  fixedAmount: formData.get("fixedAmount")
    ? Number(formData.get("fixedAmount"))
    : undefined,
  description: formData.get("description") || undefined,
  status: formData.get("status") || undefined,
});

export const createScholarshipAction = async (
  _previousState: ScholarshipActionState | null,
  formData: FormData,
): Promise<ScholarshipActionState> => {
  revalidateTag("scholarships", { expire: 0 });
  const validation = createScholarshipZodSchema.safeParse(
    getScholarshipPayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid scholarship information",
      statusCode: 400,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/scholarships`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(validation.data),
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to create scholarship",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Scholarship created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating scholarship:", error);
    return {
      success: false,
      message: "Something went wrong while creating the scholarship.",
      statusCode: 500,
    };
  }
};

export const updateScholarshipAction = async (
  _previousState: ScholarshipActionState | null,
  formData: FormData,
): Promise<ScholarshipActionState> => {
  revalidateTag("scholarships", { expire: 0 });
  const scholarshipId = formData.get("id");
  const validation = createScholarshipZodSchema.safeParse(
    getScholarshipPayload(formData),
  );

  if (!scholarshipId || typeof scholarshipId !== "string") {
    return {
      success: false,
      message: "Scholarship ID is required to update a scholarship.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid scholarship information",
      statusCode: 400,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/scholarships/${scholarshipId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(validation.data),
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to update scholarship",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Scholarship updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating scholarship:", error);
    return {
      success: false,
      message: "Something went wrong while updating the scholarship.",
      statusCode: 500,
    };
  }
};

export const deleteScholarshipAction = async (
  scholarshipId: string,
): Promise<Omit<ScholarshipActionState, "data">> => {
  revalidateTag("scholarships", { expire: 0 });
  if (!scholarshipId) {
    return {
      success: false,
      message: "Scholarship ID is required to delete a scholarship.",
      statusCode: 400,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/scholarships/${scholarshipId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Failed to delete scholarship",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Scholarship deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting scholarship:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the scholarship.",
      statusCode: 500,
    };
  }
};

export const getAllScholarshipsAction = async ({
  query,
}: { query?: ScholarshipQuery } = {}): Promise<ScholarshipResponse> => {
  const params = new URLSearchParams();
  const searchTerm = getQueryValue(query?.searchTerm);
  const page = getQueryValue(query?.page);
  const limit = getQueryValue(query?.limit);

  if (searchTerm) params.set("searchTerm", searchTerm);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
        data: null,
      };
    }

    const queryString = params.toString();
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/scholarships${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["scholarships"] },
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch scholarships",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Scholarships fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return {
      success: false,
      message: "An error occurred while fetching scholarships",
      statusCode: 500,
      data: null,
    };
  }
};
