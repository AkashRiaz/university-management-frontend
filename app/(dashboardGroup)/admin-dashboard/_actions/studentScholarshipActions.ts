"use server";

import { createStudentScholarshipZodSchema } from "@/components/validations/student-scholarship.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IStudentScholarship } from "@/types/student-scholarship.type";

type StudentScholarshipQuery = {
  [key: string]: string | string[] | undefined;
};

export type StudentScholarshipActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IStudentScholarship | null;
};

export type StudentScholarshipResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IStudentScholarship[] | null;
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

const getStudentScholarshipPayload = (formData: FormData) => ({
  studentId: formData.get("studentId"),
  scholarshipId: formData.get("scholarshipId"),
  semesterId: formData.get("semesterId"),
  status: formData.get("status") || undefined,
});

export const createStudentScholarshipAction = async (
  _previousState: StudentScholarshipActionState | null,
  formData: FormData,
): Promise<StudentScholarshipActionState> => {
  const validation = createStudentScholarshipZodSchema.safeParse(
    getStudentScholarshipPayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid student scholarship information",
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
      `${process.env.BACKEND_API_URL}/student-scholarships`,
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
        message: result?.message || "Failed to create student scholarship",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Student scholarship created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating student scholarship:", error);
    return {
      success: false,
      message: "Something went wrong while creating the student scholarship.",
      statusCode: 500,
    };
  }
};

export const updateStudentScholarshipAction = async (
  _previousState: StudentScholarshipActionState | null,
  formData: FormData,
): Promise<StudentScholarshipActionState> => {
  const studentScholarshipId = formData.get("id");
  const validation = createStudentScholarshipZodSchema.safeParse(
    getStudentScholarshipPayload(formData),
  );

  if (!studentScholarshipId || typeof studentScholarshipId !== "string") {
    return {
      success: false,
      message: "Student scholarship ID is required to update a record.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid student scholarship information",
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
      `${process.env.BACKEND_API_URL}/student-scholarships/${studentScholarshipId}`,
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
        message: result?.message || "Failed to update student scholarship",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Student scholarship updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating student scholarship:", error);
    return {
      success: false,
      message: "Something went wrong while updating the student scholarship.",
      statusCode: 500,
    };
  }
};

export const deleteStudentScholarshipAction = async (
  studentScholarshipId: string,
): Promise<Omit<StudentScholarshipActionState, "data">> => {
  if (!studentScholarshipId) {
    return {
      success: false,
      message: "Student scholarship ID is required to delete a record.",
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
      `${process.env.BACKEND_API_URL}/student-scholarships/${studentScholarshipId}`,
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
        message: result?.message || "Failed to delete student scholarship",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Student scholarship deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting student scholarship:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the student scholarship.",
      statusCode: 500,
    };
  }
};

export const getAllStudentScholarshipsAction = async ({
  query,
}: {
  query?: StudentScholarshipQuery;
} = {}): Promise<StudentScholarshipResponse> => {
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
      `${process.env.BACKEND_API_URL}/student-scholarships${queryString ? `?${queryString}` : ""}`,
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
        message: result?.message || "Failed to fetch student scholarships",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Student scholarships fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching student scholarships:", error);
    return {
      success: false,
      message: "An error occurred while fetching student scholarships",
      statusCode: 500,
      data: null,
    };
  }
};
