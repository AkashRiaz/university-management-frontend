"use server";

import { isAccessTokenExist } from "@/service/refreshToken";
import { Program } from "@/types/program.type";

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

export const getAllProgramsAction = async (
  departmentId?: string,
): Promise<ProgramResponse> => {
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
        cache: "no-store",
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
