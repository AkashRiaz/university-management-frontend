"use server";
import { revalidateTag } from "next/cache";
import { CreateDepartmentZodSchema } from "@/components/validations/department.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IDepartment } from "@/types/department.type";

export type DepartmentResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IDepartment[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

type DepartmentQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export type createDepartmentState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IDepartment | null;
};

export const createDepartmentAction = async (
  prevState: createDepartmentState,
  formData: FormData,
) => {
  revalidateTag("departments", { expire: 0 });
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

    const payload = {
      name: formData.get("name"),
      code: formData.get("code"),
      description: formData.get("description"),
      building: formData.get("building"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      facultyId: formData.get("facultyId"),
    };

    const validation = CreateDepartmentZodSchema.safeParse(payload);

    if (!validation.success) {
      return {
        success: false,
        message: "Validation failed",
        statusCode: 400,
        data: null,
      };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to create department",
        statusCode: response.status,
        data: null,
      };
    }

    return result;
  } catch (error) {
    console.error("Error creating department:", error);
    return {
      success: false,
      message: "An error occurred while creating the department",
      statusCode: 500,
      data: null,
    };
  }
};

export const getAllDepartmentsAction = async ({
  query,
}: {
  query?: DepartmentQuery;
} = {}): Promise<DepartmentResponse> => {
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
        message: "Access token not found",
        statusCode: 401,
        data: null,
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/departments${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["departments"] },
      },
    );

    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch departments",
        statusCode: response.status,
        data: null,
      };
    }

    const responseData = result?.data;
    const departments = Array.isArray(responseData)
      ? responseData
      : responseData?.data;

    return {
      success: true,
      message: "Departments fetched successfully",
      statusCode: response.status,
      data: departments || null,
      meta: result?.meta || responseData?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching departments:", error);
    return {
      success: false,
      message: "An error occurred while fetching departments",
      statusCode: 500,
      data: null,
    };
  }
};
