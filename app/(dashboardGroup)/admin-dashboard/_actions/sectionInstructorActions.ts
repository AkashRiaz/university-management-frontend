"use server";

import { revalidateTag } from "next/cache";
import {
  CreateSectionInstructorZodSchema,
  UpdateSectionInstructorZodSchema,
} from "@/components/validations/section-instructor.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { ISectionInstructor } from "@/types/section-instructor.type";

export type SectionInstructorResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: ISectionInstructor[] | null;
};

export type SectionInstructorActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: ISectionInstructor | null;
};

const getCreatePayload = (formData: FormData) => ({
  sectionId: formData.get("sectionId"),
  instructorId: formData.get("instructorId"),
  isPrimary: formData.get("isPrimary") === "true",
});

const getUpdatePayload = (formData: FormData) => ({
  isPrimary: formData.get("isPrimary") === "true",
});

const saveSectionInstructor = async (
  formData: FormData,
  method: "POST" | "PATCH",
): Promise<SectionInstructorActionState> => {
  revalidateTag("section-instructors", { expire: 0 });

  const assignmentId = formData.get("id");
  const payload =
    method === "POST" ? getCreatePayload(formData) : getUpdatePayload(formData);
  const validation =
    method === "POST"
      ? CreateSectionInstructorZodSchema.safeParse(payload)
      : UpdateSectionInstructorZodSchema.safeParse(payload);

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid section instructor information",
      statusCode: 400,
      data: null,
    };
  }

  if (method === "PATCH" && (!assignmentId || typeof assignmentId !== "string")) {
    return {
      success: false,
      message: "Section instructor assignment ID is required to update.",
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

    const endpoint =
      method === "POST"
        ? `${process.env.BACKEND_API_URL}/section-instructors`
        : `${process.env.BACKEND_API_URL}/section-instructors/${assignmentId}`;
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
          `Failed to ${method === "POST" ? "assign" : "update"} instructor`,
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message:
        result.message ||
        `Section instructor ${
          method === "POST" ? "assigned" : "updated"
        } successfully`,
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error(
      `Error ${method === "POST" ? "assigning" : "updating"} section instructor:`,
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

export const createSectionInstructorAction = async (
  _previousState: SectionInstructorActionState | null,
  formData: FormData,
) => saveSectionInstructor(formData, "POST");

export const updateSectionInstructorAction = async (
  _previousState: SectionInstructorActionState | null,
  formData: FormData,
) => saveSectionInstructor(formData, "PATCH");

export const deleteSectionInstructorAction = async (
  assignmentId: string,
) => {
  revalidateTag("section-instructors", { expire: 0 });

  if (!assignmentId) {
    return {
      success: false,
      message: "Section instructor assignment ID is required to delete.",
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
      `${process.env.BACKEND_API_URL}/section-instructors/${assignmentId}`,
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
        message: result?.message || "Failed to remove instructor",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Instructor removed successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting section instructor:", error);
    return {
      success: false,
      message: "Something went wrong while removing the instructor.",
      statusCode: 500,
    };
  }
};

export const getAllSectionInstructorsAction =
  async (): Promise<SectionInstructorResponse> => {
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
        `${process.env.BACKEND_API_URL}/section-instructors`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "force-cache",
          next: {
            revalidate: 60 * 60,
            tags: ["section-instructors"],
          },
        },
      );
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        return {
          success: false,
          message: result?.message || "Failed to fetch section instructors",
          statusCode: response.status,
          data: null,
        };
      }

      return {
        success: true,
        message: "Section instructors fetched successfully",
        statusCode: response.status,
        data: Array.isArray(result.data) ? result.data : null,
      };
    } catch (error) {
      console.error("Error fetching section instructors:", error);
      return {
        success: false,
        message: "An error occurred while fetching section instructors",
        statusCode: 500,
        data: null,
      };
    }
  };
