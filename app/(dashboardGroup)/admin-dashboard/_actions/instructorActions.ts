"use server";

import { CreateInstructorZodSchema } from "@/components/validations/instructor.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IInstructor } from "@/types/instructor.type";

export type createInstructorState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Record<string, unknown> | null;
};

type InstructorQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

type GetAllInstructorsState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IInstructor[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

export const createInstructorAction = async (
  prevState: createInstructorState,
  formData: FormData,
) => {
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
      email: formData.get("email"),
      designation: formData.get("designation"),
      specialization: formData.get("specialization"),
      phone: formData.get("phone"),
      officeRoom: formData.get("officeRoom"),
      joiningDate: formData.get("joiningDate"),
      dateOfBirth: formData.get("dateOfBirth"),
      gender: formData.get("gender"),
      address: formData.get("address"),
      bio: formData.get("bio"),
      qualification: formData.get("qualification"),
      departmentId: formData.get("departmentId"),
    };

    const validation = CreateInstructorZodSchema.safeParse(payload);

    if (!validation.success) {
      return {
        success: false,
        message:
          validation.error.issues[0]?.message ||
          "Invalid instructor information",
        statusCode: 400,
      };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/instructors`, {
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
        message: result?.message || "Failed to create instructor",
        statusCode: response.status,
        data: null,
      };
    }

    return result;
  } catch (error) {
    console.error("Error creating instructor:", error);
    return {
      success: false,
      message: "An error occurred while creating the instructor",
      statusCode: 500,
      data: null,
    };
  }
};

export const getAllInstructorsActionForAdmin = async ({
  query,
}: {
  query?: InstructorQuery;
}): Promise<GetAllInstructorsState | undefined> => {
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
      };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/instructors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch instructors",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Instructors fetched successfully",
      statusCode: response.status,
      data: result?.data || null,
      meta: result?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return {
      success: false,
      message: "An error occurred while fetching the instructors",
      statusCode: 500,
      data: null,
      meta: null,
    };
  }
};
