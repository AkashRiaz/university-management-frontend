import { isAccessTokenExist } from "@/service/refreshToken";
import { IFaculty } from "@/types/faculty.type";

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

export const getAllFaculties = async (): Promise<FacultyResponse> => {
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

    const response = await fetch(`${process.env.BACKEND_API_URL}/faculties`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    const result = await response.json();

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
