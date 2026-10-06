"use server";
import { revalidateTag } from "next/cache";

import { CreateSemesterZodSchema } from "@/components/validations/semester.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { ISemester } from "@/types/semester.type";

export type SemesterActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: ISemester | null;
};

export type SemesterResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: ISemester[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

export type SemesterQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

const getSemesterPayload = (formData: FormData) => ({
  name: formData.get("name"),
  startDate: formData.get("startDate"),
  endDate: formData.get("endDate"),
  registrationStart: formData.get("registrationStart"),
  registrationEnd: formData.get("registrationEnd"),
  status: formData.get("status") || undefined,
  academicYearId: formData.get("academicYearId"),
});

export const createSemesterAction = async (
  _previousState: SemesterActionState | null,
  formData: FormData,
): Promise<SemesterActionState> => {
  revalidateTag("semesters", { expire: 0 });
  const validation = CreateSemesterZodSchema.safeParse(
    getSemesterPayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid semester information",
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

    const response = await fetch(`${process.env.BACKEND_API_URL}/semesters`, {
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
        message: result?.message || "Failed to create semester",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Semester created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating semester:", error);
    return {
      success: false,
      message: "Something went wrong while creating the semester.",
      statusCode: 500,
    };
  }
};

export const updateSemesterAction = async (
  _previousState: SemesterActionState | null,
  formData: FormData,
): Promise<SemesterActionState> => {
  revalidateTag("semesters", { expire: 0 });
  const semesterId = formData.get("id");
  const validation = CreateSemesterZodSchema.safeParse(
    getSemesterPayload(formData),
  );

  if (!semesterId || typeof semesterId !== "string") {
    return {
      success: false,
      message: "Semester ID is required to update a semester.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid semester information",
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
      `${process.env.BACKEND_API_URL}/semesters/${semesterId}`,
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
        message: result?.message || "Failed to update semester",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Semester updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating semester:", error);
    return {
      success: false,
      message: "Something went wrong while updating the semester.",
      statusCode: 500,
    };
  }
};

export type SemesterDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteSemesterAction = async (
  semesterId: string,
): Promise<SemesterDeleteState> => {
  revalidateTag("semesters", { expire: 0 });
  if (!semesterId) {
    return {
      success: false,
      message: "Semester ID is required to delete a semester.",
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
      `${process.env.BACKEND_API_URL}/semesters/${semesterId}`,
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
        message: result?.message || "Failed to delete semester",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Semester deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting semester:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the semester.",
      statusCode: 500,
    };
  }
};

export const getAllSemestersAction = async ({
  query,
}: { query?: SemesterQuery } = {}): Promise<SemesterResponse> => {
  const params = new URLSearchParams();
  const searchTerm = getQueryValue(query?.searchTerm);
  const page = getQueryValue(query?.page);
  const limit = getQueryValue(query?.limit);

  if (searchTerm) params.set("searchTerm", searchTerm);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  try {

    const queryString = params.toString();
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/semesters${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["semesters"] },
      },
    );
    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch semesters",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Semesters fetched successfully",
      statusCode: response.status,
      data: result?.data || null,
      meta: result?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching semesters:", error);
    return {
      success: false,
      message: "An error occurred while fetching semesters",
      statusCode: 500,
      data: null,
    };
  }
};
