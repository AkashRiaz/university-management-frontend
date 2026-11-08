"use server";

import {
  CreateInstructorZodSchema,
  UpdateInstructorAdminZodSchema,
} from "@/components/validations/instructor.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IInstructor } from "@/types/instructor.type";
import { revalidateTag } from "next/cache";

export type createInstructorState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: Record<string, unknown> | null;
};

export type InstructorActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IInstructor | null;
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
  revalidateTag("instructors", { expire: 0 });
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

export const getInstructorByIdAction = async (
  instructorId: string,
): Promise<InstructorActionState> => {
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
      `${process.env.BACKEND_API_URL}/instructors/${instructorId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch instructor",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Instructor fetched successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error fetching instructor:", error);
    return {
      success: false,
      message: "An error occurred while fetching the instructor",
      statusCode: 500,
      data: null,
    };
  }
};

export const updateInstructorAdminAction = async (
  _previousState: InstructorActionState | null,
  formData: FormData,
): Promise<InstructorActionState> => {
  revalidateTag("instructors", { expire: 0 });
  const instructorId = formData.get("id");

  if (!instructorId || typeof instructorId !== "string") {
    return {
      success: false,
      message: "Instructor ID is required to update an instructor",
      statusCode: 400,
      data: null,
    };
  }

  const payload = {
    name: formData.get("name") || undefined,
    designation: formData.get("designation") || undefined,
    joiningDate: formData.get("joiningDate") || undefined,
    departmentId: formData.get("departmentId") || undefined,
    status: formData.get("status") || undefined,
  };
  const validation = UpdateInstructorAdminZodSchema.safeParse(payload);

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid instructor information",
      statusCode: 400,
      data: null,
    };
  }

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
      `${process.env.BACKEND_API_URL}/instructors/${instructorId}/admin`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(validation.data),
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to update instructor",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: result.message || "Instructor updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating instructor:", error);
    return {
      success: false,
      message: "An error occurred while updating the instructor",
      statusCode: 500,
      data: null,
    };
  }
};

export type InstructorDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteInstructorAction = async (
  instructorId: string,
): Promise<InstructorDeleteState> => {
  revalidateTag("instructors", { expire: 0 });
  if (!instructorId) {
    return {
      success: false,
      message: "Instructor ID is required to delete an instructor",
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
      `${process.env.BACKEND_API_URL}/instructors/${instructorId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Failed to delete instructor",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Instructor deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting instructor:", error);
    return {
      success: false,
      message: "An error occurred while deleting the instructor",
      statusCode: 500,
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

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/instructors${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["instructors"] },
      },
    );

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
