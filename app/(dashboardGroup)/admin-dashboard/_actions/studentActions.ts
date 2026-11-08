"use server";
import { revalidateTag } from "next/cache";

import {
  createStudentSchema,
  UpdateStudentAdminZodSchema,
} from "@/components/validations/student.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { cookies } from "next/headers";
import { UserStatus } from "@/types/common.type";

type CreateStudentState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Record<string, unknown> | null;
};

export type Student = {
  id: string;
  email?: string | null;
  departmentId?: string | null;
  programId?: string | null;
  admissionDate?: string | null;
  admissionYear?: number | null;
  currentSemesterNumber?: number | null;
  status?: "ACTIVE" | "INACTIVE" | "GRADUATED" | "SUSPENDED" | null;
  academicStatus?:
    | "GOOD_STANDING"
    | "PROBATION"
    | "SUSPENDED"
    | "DISMISSED"
    | null;
  phone?: string | null;
  user?: {
    name?: string | null;
    email?: string | null;
    status?: UserStatus | null;
  } | null;
  department?: {
    code?: string | null;
  } | null;
  program?: {
    code?: string | null;
  } | null;
};

export type StudentActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Student | null;
};

type GetAllStudentsState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Student[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

type StudentQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export const createStudentAction = async (
  prevState: CreateStudentState | null,
  formData: FormData,
): Promise<CreateStudentState> => {
  revalidateTag("students", { expire: 0 });
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    departmentId: formData.get("departmentId"),
    admissionDate: formData.get("admissionDate"),
    admissionYear: Number(formData.get("admissionYear")),
    gender: formData.get("gender"),
    phone: formData.get("phone"),
    programId: formData.get("programId"),
    address: formData.get("address"),
    emergencyContactName: formData.get("emergencyContactName"),
    emergencyContactPhone: formData.get("emergencyContactPhone"),
  };

  const validation = createStudentSchema.safeParse(payload);

  if (!validation.success) {
    return {
      success: false,
      statusCode: 400,
      message:
        validation.error.issues[0]?.message || "Invalid student information",
    };
  }

  const cookieStore = await cookies();
  const accessToken: string | undefined = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      statusCode: 401,
      message: "User not logged in",
    };
  }

  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/students/register`,
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

    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        statusCode: response.status,
        message: result?.message || "Failed to create student",
        data: null,
      };
    }

    // redirect("/admin-dashboard/students");

    return {
      success: true,
      message: "Student created successfully",
      statusCode: response.status,
      data: result?.data || null,
    };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Something went wrong. Please try again.",
      data: null,
    };
  }
};

export const getAllStudentsActionForAdmin = async ({
  query,
}: {
  query?: StudentQuery;
}): Promise<GetAllStudentsState | undefined> => {
  const params = new URLSearchParams();

  const searchTerm = getQueryValue(query?.searchTerm);
  const page = getQueryValue(query?.page);
  const limit = getQueryValue(query?.limit);
  const isDeleted = getQueryValue(query?.isDeleted);
  const sortBy = getQueryValue(query?.sortBy);
  const sortOrder = getQueryValue(query?.sortOrder);
  if (searchTerm) {
    params.set("searchTerm", searchTerm);
  }

  if (page) {
    params.set("page", page);
  }

  if (limit) {
    params.set("limit", limit);
  }

  params.set("isDeleted", isDeleted === "true" ? "true" : "false");

  if (sortBy) {
    params.set("sortBy", sortBy);
  }

  if (sortOrder === "asc" || sortOrder === "desc") {
    params.set("sortOrder", sortOrder);
  }

  const queryString = params.toString();
  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return {
        success: false,
        statusCode: 401,
        message: "User not logged in",
        data: null,
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/students${
        queryString ? `?${queryString}` : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        statusCode: response.status,
        message: result?.message || "Failed to fetch students",
        data: null,
      };
    }

    return {
      success: true,
      message: "Students fetched successfully",
      statusCode: response.status,
      data: result?.data?.data || null,
      meta: result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Something went wrong. Please try again.",
      data: null,
    };
  }
};

export const getStudentByIdAction = async (
  studentId: string,
): Promise<StudentActionState> => {
  if (!studentId) {
    return {
      success: false,
      message: "Student ID is required",
      statusCode: 400,
      data: null,
    };
  }

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

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/students/${studentId}`,
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
        message: result?.message || "Failed to fetch student",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Student fetched successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error fetching student:", error);
    return {
      success: false,
      message: "An error occurred while fetching the student",
      statusCode: 500,
      data: null,
    };
  }
};

export const updateStudentAdminAction = async (
  _previousState: StudentActionState | null,
  formData: FormData,
): Promise<StudentActionState> => {
  revalidateTag("students", { expire: 0 });
  const studentId = formData.get("id");

  if (!studentId || typeof studentId !== "string") {
    return {
      success: false,
      message: "Student ID is required to update a student",
      statusCode: 400,
      data: null,
    };
  }

  const payload = {
    name: formData.get("name") || undefined,
    email: formData.get("email") || undefined,
    departmentId: formData.get("departmentId") || undefined,
    programId: formData.get("programId") || undefined,
    admissionDate: formData.get("admissionDate") || undefined,
    admissionYear: formData.get("admissionYear") || undefined,
    currentSemesterNumber: formData.get("currentSemesterNumber") || undefined,
    status: formData.get("status") || undefined,
    academicStatus: formData.get("academicStatus") || undefined,
  };
  const validation = UpdateStudentAdminZodSchema.safeParse(payload);

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid student information",
      statusCode: 400,
      data: null,
    };
  }

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

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/students/${studentId}/admin`,
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
        message: result?.message || "Failed to update student",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: result.message || "Student updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating student:", error);
    return {
      success: false,
      message: "An error occurred while updating the student",
      statusCode: 500,
      data: null,
    };
  }
};

export type StudentDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteStudentAction = async (
  studentId: string,
): Promise<StudentDeleteState> => {
  revalidateTag("students", { expire: 0 });

  if (!studentId) {
    return {
      success: false,
      message: "Student ID is required to delete a student",
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
      `${process.env.BACKEND_API_URL}/students/${studentId}`,
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
        message: result?.message || "Failed to delete student",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Student deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting student:", error);
    return {
      success: false,
      message: "An error occurred while deleting the student",
      statusCode: 500,
    };
  }
};

export const restoreStudentAction = async (
  studentId: string,
): Promise<StudentDeleteState> => {
  revalidateTag("students", { expire: 0 });

  if (!studentId) {
    return {
      success: false,
      message: "Student ID is required to restore a student",
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
      `${process.env.BACKEND_API_URL}/students/${studentId}/admin`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ isDeleted: false }),
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Failed to restore student",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Student restored successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error restoring student:", error);
    return {
      success: false,
      message: "An error occurred while restoring the student",
      statusCode: 500,
    };
  }
};
