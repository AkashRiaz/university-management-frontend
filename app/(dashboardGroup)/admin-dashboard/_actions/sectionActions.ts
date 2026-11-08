"use server";
import { revalidateTag } from "next/cache";

import { CreateSectionZodSchema } from "@/components/validations/section.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { ISection } from "@/types/section.type";

export type SectionActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: ISection | null;
};

export type SectionResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: ISection[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

type SectionQuery = { [key: string]: string | string[] | undefined };

const getQueryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const getSectionPayload = (formData: FormData) => ({
  name: formData.get("name"),
  capacity: Number(formData.get("capacity")),
  status: formData.get("status"),
  courseId: formData.get("courseId"),
  semesterId: formData.get("semesterId"),
  departmentId: formData.get("departmentId"),
  roomId: formData.get("roomId") || "",
});

export const createSectionAction = async (
  _previousState: SectionActionState | null,
  formData: FormData,
): Promise<SectionActionState> => {
  revalidateTag("sections", { expire: 0 });
  const validation = CreateSectionZodSchema.safeParse(
    getSectionPayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid section information",
      statusCode: 400,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken)
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };

    const response = await fetch(`${process.env.BACKEND_API_URL}/sections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...validation.data,
        roomId: validation.data.roomId || undefined,
      }),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to create section",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Section created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating section:", error);
    return {
      success: false,
      message: "Something went wrong while creating the section.",
      statusCode: 500,
    };
  }
};

export const updateSectionAction = async (
  _previousState: SectionActionState | null,
  formData: FormData,
): Promise<SectionActionState> => {
  revalidateTag("sections", { expire: 0 });
  const sectionId = formData.get("id");
  const validation = CreateSectionZodSchema.safeParse(
    getSectionPayload(formData),
  );

  if (!sectionId || typeof sectionId !== "string") {
    return {
      success: false,
      message: "Section ID is required to update a section.",
      statusCode: 400,
    };
  }
  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid section information",
      statusCode: 400,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken)
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
      };

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/sections/${sectionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...validation.data,
          roomId: validation.data.roomId || undefined,
        }),
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to update section",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Section updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating section:", error);
    return {
      success: false,
      message: "Something went wrong while updating the section.",
      statusCode: 500,
    };
  }
};

export type SectionDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteSectionAction = async (
  sectionId: string,
): Promise<SectionDeleteState> => {
  revalidateTag("sections", { expire: 0 });
  if (!sectionId)
    return {
      success: false,
      message: "Section ID is required to delete a section.",
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
      `${process.env.BACKEND_API_URL}/sections/${sectionId}`,
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
        message: result?.message || "Failed to delete section",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Section deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting section:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the section.",
      statusCode: 500,
    };
  }
};

export const getAllSectionsAction = async ({
  query,
}: { query?: SectionQuery } = {}): Promise<SectionResponse> => {
  const params = new URLSearchParams();
  const searchTerm = getQueryValue(query?.searchTerm);
  const page = getQueryValue(query?.page);
  const limit = getQueryValue(query?.limit);
  if (searchTerm) params.set("searchTerm", searchTerm);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken)
      return {
        success: false,
        message: "Access token not found",
        statusCode: 401,
        data: null,
      };

    const queryString = params.toString();
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/sections${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["sections"] },
      },
    );
    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch sections",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Sections fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching sections:", error);
    return {
      success: false,
      message: "An error occurred while fetching sections",
      statusCode: 500,
      data: null,
    };
  }
};
