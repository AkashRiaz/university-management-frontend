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

type ProgramQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export const createProgramAction = async (
  prevState: ProgramPrevState | null,
  formData: FormData,
): Promise<ProgramPrevState> => {
  revalidateTag("programs", { expire: 0 });
  try {
    const accessToken = await isAccessTokenExist();

    if (!accessToken) {
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };
    }

    const payload = {
      name: formData.get("name"),
      code: formData.get("code"),
      description: formData.get("description"),
      durationYears: Number(formData.get("durationYears")),
      totalCredits: Number(formData.get("totalCredits")),
      departmentId: formData.get("departmentId"),
    };

    const validation = CreateProgramZodSchema.safeParse(payload);
    // console.log("Validation result:", validation.error);

    if (!validation.success) {
      return {
        success: false,
        message: "Validation failed",
        statusCode: 400,
      };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/programs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validation.data),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to create program",
        statusCode: response.status,
      };
    }

    return result;
  } catch (error) {
    console.error("Error creating program:", error);
    return {
      success: false,
      message: "An error occurred while creating the program",
      statusCode: 500,
    };
  }
};

export const getAllProgramsAction = async ({
  query,
}: {
  query?: ProgramQuery;
} = {}): Promise<ProgramResponse> => {
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

    const params = new URLSearchParams();
    const searchTerm = getQueryValue(query?.searchTerm);
    const page = getQueryValue(query?.page);
    const limit = getQueryValue(query?.limit);
    const departmentId = getQueryValue(query?.departmentId);

    if (searchTerm) {
      params.set("searchTerm", searchTerm);
    }

    if (page) {
      params.set("page", page);
    }

    if (limit) {
      params.set("limit", limit);
    }

    if (departmentId) {
      params.set("departmentId", departmentId);
    }

    const queryString = params.toString();
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/programs${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["programs"] },
      },
    );

    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch programs",
        statusCode: response.status,
        data: null,
      };
    }

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
