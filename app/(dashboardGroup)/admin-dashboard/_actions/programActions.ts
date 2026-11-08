"use server";

import { revalidateTag } from "next/cache";
import { CreateProgramZodSchema } from "@/components/validations/program.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { Program } from "@/types/program.type";

export type ProgramPrevState = {
  success: boolean;
  message?: string;
  statusCode?: number;
  data?: Record<string, unknown> | null;
};

export type ProgramActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Program | null;
};

export type ProgramResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Program[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

type ProgramQuery = { [key: string]: string | string[] | undefined };
const getQueryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const saveProgram = async (
  formData: FormData,
  method: "POST" | "PATCH",
): Promise<ProgramActionState> => {
  revalidateTag("programs", { expire: 0 });
  const programId = formData.get("id");
  const payload = {
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description"),
    durationYears: Number(formData.get("durationYears")),
    totalCredits: Number(formData.get("totalCredits")),
    departmentId: formData.get("departmentId"),
  };
  const validation = CreateProgramZodSchema.safeParse(payload);
  if (!validation.success)
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid program information",
      statusCode: 400,
      data: null,
    };

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken)
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
        data: null,
      };
    const endpoint =
      method === "POST"
        ? `${process.env.BACKEND_API_URL}/programs`
        : `${process.env.BACKEND_API_URL}/programs/${programId}`;
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
    if (!response.ok || !result?.success)
      return {
        success: false,
        message:
          result?.message ||
          `Failed to ${method === "POST" ? "create" : "update"} program`,
        statusCode: response.status,
        data: null,
      };
    return {
      success: true,
      message:
        result.message ||
        `Program ${method === "POST" ? "created" : "updated"} successfully`,
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error(
      `Error ${method === "POST" ? "creating" : "updating"} program:`,
      error,
    );
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      statusCode: 500,
      data: null,
    };
  }
};

export const createProgramAction = async (
  _previousState: ProgramPrevState | null,
  formData: FormData,
) => saveProgram(formData, "POST");
export const updateProgramAction = async (
  _previousState: ProgramActionState | null,
  formData: FormData,
) => saveProgram(formData, "PATCH");

export const getProgramByIdAction = async (
  programId: string,
): Promise<ProgramActionState> => {
  if (!programId)
    return {
      success: false,
      message: "Program ID is required",
      statusCode: 400,
      data: null,
    };
  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken)
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
        data: null,
      };
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/programs/${programId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success)
      return {
        success: false,
        message: result?.message || "Failed to fetch program",
        statusCode: response.status,
        data: null,
      };
    return {
      success: true,
      message: "Program fetched successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error fetching program:", error);
    return {
      success: false,
      message: "An error occurred while fetching the program",
      statusCode: 500,
      data: null,
    };
  }
};

export type ProgramDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteProgramAction = async (
  programId: string,
): Promise<ProgramDeleteState> => {
  revalidateTag("programs", { expire: 0 });
  if (!programId)
    return {
      success: false,
      message: "Program ID is required to delete a program",
      statusCode: 400,
    };
  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken)
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/programs/${programId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.success === false)
      return {
        success: false,
        message: result?.message || "Failed to delete program",
        statusCode: response.status,
      };
    return {
      success: true,
      message: result?.message || "Program deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting program:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the program.",
      statusCode: 500,
    };
  }
};

export const getAllProgramsAction = async ({
  query,
}: { query?: ProgramQuery } = {}): Promise<ProgramResponse> => {
  try {
    const params = new URLSearchParams();
    const searchTerm = getQueryValue(query?.searchTerm);
    const page = getQueryValue(query?.page);
    const limit = getQueryValue(query?.limit);
    const departmentId = getQueryValue(query?.departmentId);
    if (searchTerm) params.set("searchTerm", searchTerm);
    if (page) params.set("page", page);
    if (limit) params.set("limit", limit);
    if (departmentId) params.set("departmentId", departmentId);
    const queryString = params.toString();
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/programs${queryString ? `?${queryString}` : ""}`,
      {
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["programs"] },
      },
    );
    const result = await response.json();
    if (!response.ok || !result?.success)
      return {
        success: false,
        message: result?.message || "Failed to fetch programs",
        statusCode: response.status,
        data: null,
      };
    return {
      success: true,
      message: "Programs fetched successfully",
      statusCode: response.status,
      data: result?.data || null,
      meta: result?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching programs:", error);
    return {
      success: false,
      message: "An error occurred while fetching programs",
      statusCode: 500,
      data: null,
    };
  }
};
