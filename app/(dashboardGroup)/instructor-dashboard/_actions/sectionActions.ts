"use server";

import { isAccessTokenExist } from "@/service/refreshToken";

export type InstructorSection = {
  id: string;
  isPrimary?: boolean;
  section?: {
    id: string;
    name?: string;
    capacity?: number;
    status?: string;
    course?: { id?: string; code?: string; title?: string; credit?: number };
    semester?: {
      id?: string;
      name?: string;
      academicYear?: { name?: string };
    };
  };
};

export type InstructorSectionsResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: InstructorSection[] | null;
};

export const getMyInstructorSectionsAction =
  async (): Promise<InstructorSectionsResponse> => {
    try {
      const accessToken = await isAccessTokenExist();
      if (!accessToken) {
        return { success: false, message: "Access token not found", statusCode: 401, data: null };
      }

      const response = await fetch(
        `${process.env.BACKEND_API_URL}/section-instructors/my-sections`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        },
      );
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        return {
          success: false,
          message: result?.message || "Failed to fetch assigned sections",
          statusCode: response.status,
          data: null,
        };
      }

      const data = Array.isArray(result.data) ? result.data : result.data?.data;
      return {
        success: true,
        message: result.message || "Assigned sections fetched successfully",
        statusCode: response.status,
        data: data || [],
      };
    } catch (error) {
      console.error("Error fetching assigned sections:", error);
      return {
        success: false,
        message: "An error occurred while fetching assigned sections",
        statusCode: 500,
        data: null,
      };
    }
  };
