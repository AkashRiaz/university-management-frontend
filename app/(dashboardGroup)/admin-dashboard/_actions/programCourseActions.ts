"use server";

import { CreateProgramCourseZodSchema } from "@/components/validations/program-course.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IProgramCourse } from "@/types/program-course.type";

export type ProgramCourseActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IProgramCourse | null;
};

export type ProgramCourseResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IProgramCourse[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

type ProgramCourseQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
};

const getProgramCoursePayload = (formData: FormData) => ({
  programId: formData.get("programId"),
  courseId: formData.get("courseId"),
  semesterNumber: Number(formData.get("semesterNumber")),
  isRequired: formData.get("isRequired") === "true",
});

export const createProgramCourseAction = async (
  _previousState: ProgramCourseActionState | null,
  formData: FormData,
): Promise<ProgramCourseActionState> => {
  const validation = CreateProgramCourseZodSchema.safeParse(
    getProgramCoursePayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid program course information",
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
      `${process.env.BACKEND_API_URL}/program-courses`,
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
        message: result?.message || "Failed to assign course to program",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Course assigned to program successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating program course:", error);
    return {
      success: false,
      message: "Something went wrong while assigning the course.",
      statusCode: 500,
    };
  }
};

export const updateProgramCourseAction = async (
  _previousState: ProgramCourseActionState | null,
  formData: FormData,
): Promise<ProgramCourseActionState> => {
  const programCourseId = formData.get("id");
  const validation = CreateProgramCourseZodSchema.safeParse(
    getProgramCoursePayload(formData),
  );

  if (!programCourseId || typeof programCourseId !== "string") {
    return {
      success: false,
      message: "Program course ID is required to update this assignment.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid program course information",
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
      `${process.env.BACKEND_API_URL}/program-courses/${programCourseId}`,
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
        message: result?.message || "Failed to update program course",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Program course updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating program course:", error);
    return {
      success: false,
      message: "Something went wrong while updating the course assignment.",
      statusCode: 500,
    };
  }
};

export type ProgramCourseDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteProgramCourseAction = async (
  programCourseId: string,
): Promise<ProgramCourseDeleteState> => {
  if (!programCourseId) {
    return {
      success: false,
      message: "Program course ID is required to delete this assignment.",
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
      `${process.env.BACKEND_API_URL}/program-courses/${programCourseId}`,
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
        message: result?.message || "Failed to delete program course",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Course removed from program successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting program course:", error);
    return {
      success: false,
      message: "Something went wrong while removing the course.",
      statusCode: 500,
    };
  }
};

export const getAllProgramCoursesAction = async ({
  query,
}: { query?: ProgramCourseQuery } = {}): Promise<ProgramCourseResponse> => {
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
      `${process.env.BACKEND_API_URL}/program-courses${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );
    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch program courses",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Program courses fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching program courses:", error);
    return {
      success: false,
      message: "An error occurred while fetching program courses",
      statusCode: 500,
      data: null,
    };
  }
};
