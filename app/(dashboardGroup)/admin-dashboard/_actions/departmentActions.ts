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
  meta?: { page: number; limit: number; total: number; totalPages: number } | null;
};

export type DepartmentActionState = {
  success: boolean;
  message: string;
  error?: string;
  statusCode?: number;
  data?: IDepartment | null;
};

export type createDepartmentState = DepartmentActionState;

type DepartmentQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const saveDepartment = async (
  formData: FormData,
  method: "POST" | "PATCH",
): Promise<DepartmentActionState> => {
  revalidateTag("departments", { expire: 0 });
  const departmentId = formData.get("id");
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
      message: validation.error.issues[0]?.message || "Invalid department information",
      statusCode: 400,
      data: null,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return { success: false, message: "Access token not found", statusCode: 401, data: null };
    }

    const endpoint =
      method === "POST"
        ? `${process.env.BACKEND_API_URL}/departments`
        : `${process.env.BACKEND_API_URL}/departments/${departmentId}`;
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
        message: result?.message || `Failed to ${method === "POST" ? "create" : "update"} department`,
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: result.message || `Department ${method === "POST" ? "created" : "updated"} successfully`,
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error(`Error ${method === "POST" ? "creating" : "updating"} department:`, error);
    return { success: false, message: "Something went wrong. Please try again.", statusCode: 500, data: null };
  }
};

export const createDepartmentAction = async (
  _previousState: createDepartmentState | null,
  formData: FormData,
) => saveDepartment(formData, "POST");

export const updateDepartmentAction = async (
  _previousState: DepartmentActionState | null,
  formData: FormData,
) => saveDepartment(formData, "PATCH");

export const getDepartmentByIdAction = async (
  departmentId: string,
): Promise<DepartmentActionState> => {
  if (!departmentId) return { success: false, message: "Department ID is required", statusCode: 400, data: null };

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) return { success: false, message: "Access token not found", statusCode: 401, data: null };
    const response = await fetch(`${process.env.BACKEND_API_URL}/departments/${departmentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) {
      return { success: false, message: result?.message || "Failed to fetch department", statusCode: response.status, data: null };
    }
    return { success: true, message: "Department fetched successfully", statusCode: response.status, data: result.data || null };
  } catch (error) {
    console.error("Error fetching department:", error);
    return { success: false, message: "An error occurred while fetching the department", statusCode: 500, data: null };
  }
};

export type DepartmentDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteDepartmentAction = async (
  departmentId: string,
): Promise<DepartmentDeleteState> => {
  revalidateTag("departments", { expire: 0 });
  if (!departmentId) return { success: false, message: "Department ID is required to delete a department", statusCode: 400 };

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) return { success: false, message: "Access token not found", statusCode: 401 };
    const response = await fetch(`${process.env.BACKEND_API_URL}/departments/${departmentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success === false) {
      return { success: false, message: result?.message || "Failed to delete department", statusCode: response.status };
    }
    return { success: true, message: result?.message || "Department deleted successfully", statusCode: response.status };
  } catch (error) {
    console.error("Error deleting department:", error);
    return { success: false, message: "Something went wrong while deleting the department.", statusCode: 500 };
  }
};

export const getAllDepartmentsAction = async ({
  query,
}: { query?: DepartmentQuery } = {}): Promise<DepartmentResponse> => {
  const params = new URLSearchParams();
  const searchTerm = getQueryValue(query?.searchTerm);
  const page = getQueryValue(query?.page);
  const limit = getQueryValue(query?.limit);
  if (searchTerm) params.set("searchTerm", searchTerm);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) return { success: false, message: "Access token not found", statusCode: 401, data: null };
    const queryString = params.toString();
    const response = await fetch(`${process.env.BACKEND_API_URL}/departments${queryString ? `?${queryString}` : ""}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "force-cache",
      next: { revalidate: 60 * 60, tags: ["departments"] },
    });
    const result = await response.json();
    if (!response.ok || !result?.success) return { success: false, message: result?.message || "Failed to fetch departments", statusCode: response.status, data: null };
    const responseData = result.data;
    const departments = Array.isArray(responseData) ? responseData : responseData?.data;
    return { success: true, message: "Departments fetched successfully", statusCode: response.status, data: departments || null, meta: result?.meta || responseData?.meta || null };
  } catch (error) {
    console.error("Error fetching departments:", error);
    return { success: false, message: "An error occurred while fetching departments", statusCode: 500, data: null };
  }
};
