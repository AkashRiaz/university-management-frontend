"use server";

import { createGradeZodSchema } from "@/components/validations/grade.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IGrade } from "@/types/grade.type";

type GradeQuery = {
  [key: string]: string | string[] | undefined;
};

export type GradeActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IGrade | null;
};

export type GradeResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IGrade[] | null;
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

const getGradePayload = (formData: FormData) => ({
  letter: formData.get("letter"),
  minMarks: Number(formData.get("minMarks")),
  maxMarks: Number(formData.get("maxMarks")),
  gradePoint: Number(formData.get("gradePoint")),
  type: formData.get("type"),
  gradeScaleId: formData.get("gradeScaleId"),
});

export const createGradeAction = async (
  _previousState: GradeActionState | null,
  formData: FormData,
): Promise<GradeActionState> => {
  const validation = createGradeZodSchema.safeParse(getGradePayload(formData));

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid grade information",
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

    const response = await fetch(`${process.env.BACKEND_API_URL}/grades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validation.data),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to create grade",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Grade created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating grade:", error);
    return {
      success: false,
      message: "Something went wrong while creating the grade.",
      statusCode: 500,
    };
  }
};

export const updateGradeAction = async (
  _previousState: GradeActionState | null,
  formData: FormData,
): Promise<GradeActionState> => {
  const gradeId = formData.get("id");
  const validation = createGradeZodSchema.safeParse(getGradePayload(formData));

  if (!gradeId || typeof gradeId !== "string") {
    return {
      success: false,
      message: "Grade ID is required to update a grade.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid grade information",
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
      `${process.env.BACKEND_API_URL}/grades/${gradeId}`,
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
        message: result?.message || "Failed to update grade",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Grade updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating grade:", error);
    return {
      success: false,
      message: "Something went wrong while updating the grade.",
      statusCode: 500,
    };
  }
};

export const deleteGradeAction = async (
  gradeId: string,
): Promise<Omit<GradeActionState, "data">> => {
  if (!gradeId) {
    return {
      success: false,
      message: "Grade ID is required to delete a grade.",
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
      `${process.env.BACKEND_API_URL}/grades/${gradeId}`,
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
        message: result?.message || "Failed to delete grade",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Grade deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting grade:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the grade.",
      statusCode: 500,
    };
  }
};

export const getGradesByGradeScaleAction = async (
  gradeScaleId: string,
  { query }: { query?: GradeQuery } = {},
): Promise<GradeResponse> => {
  if (!gradeScaleId) {
    return {
      success: false,
      message: "Grade scale ID is required to fetch grades.",
      statusCode: 400,
      data: null,
    };
  }

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
      `${process.env.BACKEND_API_URL}/grades/gradescale/${gradeScaleId}${queryString ? `?${queryString}` : ""}`,
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
        message: result?.message || "Failed to fetch grades by grade scale",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Grades fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching grades by grade scale:", error);
    return {
      success: false,
      message: "An error occurred while fetching grades by grade scale",
      statusCode: 500,
      data: null,
    };
  }
};
