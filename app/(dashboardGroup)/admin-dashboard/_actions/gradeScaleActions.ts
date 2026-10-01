"use server";

import { createGradeScaleZodSchema } from "@/components/validations/grade-schale.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IGradeScale } from "@/types/grade-scale.type";

type GradeScaleQuery = {
  [key: string]: string | string[] | undefined;
};

export type GradeScaleActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IGradeScale | null;
};

export type GradeScaleResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IGradeScale[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

const getQueryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const getGradeScalePayload = (formData: FormData) => ({
  name: formData.get("name"),
  description: formData.get("description") || undefined,
});

export const createGradeScaleAction = async (
  _previousState: GradeScaleActionState | null,
  formData: FormData,
): Promise<GradeScaleActionState> => {
  const validation = createGradeScaleZodSchema.safeParse(
    getGradeScalePayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid grade scale information",
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
      `${process.env.BACKEND_API_URL}/grade-scales`,
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
        message: result?.message || "Failed to create grade scale",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Grade scale created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating grade scale:", error);
    return {
      success: false,
      message: "Something went wrong while creating the grade scale.",
      statusCode: 500,
    };
  }
};

export const updateGradeScaleAction = async (
  _previousState: GradeScaleActionState | null,
  formData: FormData,
): Promise<GradeScaleActionState> => {
  const gradeScaleId = formData.get("id");
  const validation = createGradeScaleZodSchema.safeParse(
    getGradeScalePayload(formData),
  );

  if (!gradeScaleId || typeof gradeScaleId !== "string") {
    return {
      success: false,
      message: "Grade scale ID is required to update a grade scale.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid grade scale information",
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
      `${process.env.BACKEND_API_URL}/grade-scales/${gradeScaleId}`,
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
        message: result?.message || "Failed to update grade scale",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Grade scale updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating grade scale:", error);
    return {
      success: false,
      message: "Something went wrong while updating the grade scale.",
      statusCode: 500,
    };
  }
};

export const deleteGradeScaleAction = async (
  gradeScaleId: string,
): Promise<Omit<GradeScaleActionState, "data">> => {
  if (!gradeScaleId) {
    return {
      success: false,
      message: "Grade scale ID is required to delete a grade scale.",
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
      `${process.env.BACKEND_API_URL}/grade-scales/${gradeScaleId}`,
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
        message: result?.message || "Failed to delete grade scale",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Grade scale deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting grade scale:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the grade scale.",
      statusCode: 500,
    };
  }
};

export const getAllGradeScalesAction = async ({
  query,
}: { query?: GradeScaleQuery } = {}): Promise<GradeScaleResponse> => {
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
      `${process.env.BACKEND_API_URL}/grade-scales${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch grade scales",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Grade scales fetched successfully",
      statusCode: response.status,
      data: result.data || null,
      meta: result.meta || null,
    };
  } catch (error) {
    console.error("Error fetching grade scales:", error);
    return {
      success: false,
      message: "An error occurred while fetching grade scales",
      statusCode: 500,
      data: null,
    };
  }
};
