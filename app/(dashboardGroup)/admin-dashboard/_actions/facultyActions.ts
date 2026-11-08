"use server";
import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IFaculty } from "@/types/faculty.type";
import { FacultySchema } from "@/components/validations/faculty.validation";

export type FacultyActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IFaculty | null;
};

type FacultyResponse = {
  success: boolean;
  message?: string;
  statusCode?: number;
  data?: IFaculty[] | null;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
};

type FacultyQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

const saveFaculty = async (
  formData: FormData,
  method: "POST" | "PATCH",
): Promise<FacultyActionState> => {
  revalidateTag("faculties", { expire: 0 });
  const payload = {
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description") || "",
  };
  const validation = FacultySchema.safeParse(payload);

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid faculty information",
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

    const facultyId = formData.get("id");
    const endpoint =
      method === "POST"
        ? `${process.env.BACKEND_API_URL}/faculties`
        : `${process.env.BACKEND_API_URL}/faculties/${facultyId}`;
    const response = await fetch(endpoint, {
      method,
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
        message:
          result?.message ||
          `Failed to ${method === "POST" ? "create" : "update"} faculty`,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message:
        result.message ||
        `Faculty ${method === "POST" ? "created" : "updated"} successfully`,
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error(
      `Error ${method === "POST" ? "creating" : "updating"} faculty:`,
      error,
    );
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      statusCode: 500,
    };
  }
};

export const createFacultyAction = async (
  _previousState: FacultyActionState | null,
  formData: FormData,
) => saveFaculty(formData, "POST");

export const updateFacultyAction = async (
  _previousState: FacultyActionState | null,
  formData: FormData,
) => saveFaculty(formData, "PATCH");

export type FacultyDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteFacultyAction = async (
  facultyId: string,
): Promise<FacultyDeleteState> => {
  revalidateTag("faculties", { expire: 0 });
  if (!facultyId) {
    return {
      success: false,
      message: "Faculty ID is required to delete a faculty.",
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
      `${process.env.BACKEND_API_URL}/faculties/${facultyId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Failed to delete faculty",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Faculty deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting faculty:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the faculty.",
      statusCode: 500,
    };
  }
};

export const getAllFaculties = async ({
  query,
}: {
  query?: FacultyQuery;
} = {}): Promise<FacultyResponse> => {
  const params = new URLSearchParams();
  const searchTerm = getQueryValue(query?.searchTerm);
  const page = getQueryValue(query?.page);
  const limit = getQueryValue(query?.limit);

  if (searchTerm) params.set("searchTerm", searchTerm);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  const queryString = params.toString();

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
      `${process.env.BACKEND_API_URL}/faculties${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["faculties"] },
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to fetch faculties",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Faculties fetched successfully",
      statusCode: response.status,
      data: result.data?.data || [],
      meta: result.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return {
      success: false,
      message: "Error fetching faculties",
      statusCode: 500,
      data: null,
    };
  }
};
