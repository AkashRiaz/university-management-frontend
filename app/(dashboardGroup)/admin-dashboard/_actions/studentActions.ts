"use server";
import { revalidateTag } from "next/cache";

import { createStudentSchema } from "@/components/validations/student.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { cookies } from "next/headers";

type CreateStudentState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Record<string, unknown> | null;
};

export type Student = {
  id: string;
  admissionYear?: number | null;
  phone?: string | null;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  department?: {
    code?: string | null;
  } | null;
  program?: {
    code?: string | null;
  } | null;
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
  if (searchTerm) {
    params.set("searchTerm", searchTerm);
  }

  if (page) {
    params.set("page", page);
  }

  if (limit) {
    params.set("limit", limit);
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
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["students"] },
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
