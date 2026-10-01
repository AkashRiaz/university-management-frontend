"use server";
import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IAcademicYear } from "@/types/academic-year.type";
import { CreateAcademicYearZodSchema } from "@/components/validations/academic-year.validation";

export type AcademicYearActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IAcademicYear | null;
};

export type AcademicYearResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IAcademicYear[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

type AcademicYearQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

export const createAcademicYearAction = async (
  _previousState: AcademicYearActionState | null,
  formData: FormData,
): Promise<AcademicYearActionState> => {
  const payload = {
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  };
  const validation = CreateAcademicYearZodSchema.safeParse(payload);

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid academic year information",
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
      `${process.env.BACKEND_API_URL}/academic-years`,
      {
        method: "POST",
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
        message: result?.message || "Failed to create academic year",
        statusCode: response.status,
      };
    }

    revalidateTag("academic-years", { expire: 0 });
    revalidateTag("semesters", { expire: 0 });
    revalidateTag("class-schedules", { expire: 0 });

    return {
      success: true,
      message: result.message || "Academic year created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating academic year:", error);
    return {
      success: false,
      message: "Something went wrong while creating the academic year.",
      statusCode: 500,
    };
  }
};

export const updateAcademicYearAction = async (
  _previousState: AcademicYearActionState | null,
  formData: FormData,
): Promise<AcademicYearActionState> => {
  const academicYearId = formData.get("id");
  const payload = {
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  };
  const validation = CreateAcademicYearZodSchema.safeParse(payload);

  if (!academicYearId || typeof academicYearId !== "string") {
    return {
      success: false,
      message: "Academic year ID is required to update an academic year.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid academic year information",
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
      `${process.env.BACKEND_API_URL}/academic-years/${academicYearId}`,
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
        message: result?.message || "Failed to update academic year",
        statusCode: response.status,
      };
    }

    revalidateTag("academic-years", { expire: 0 });
    revalidateTag("semesters", { expire: 0 });
    revalidateTag("class-schedules", { expire: 0 });

    return {
      success: true,
      message: result.message || "Academic year updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating academic year:", error);
    return {
      success: false,
      message: "Something went wrong while updating the academic year.",
      statusCode: 500,
    };
  }
};

export type AcademicYearDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteAcademicYearAction = async (
  academicYearId: string,
): Promise<AcademicYearDeleteState> => {
  if (!academicYearId) {
    return {
      success: false,
      message: "Academic year ID is required to delete an academic year.",
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
      `${process.env.BACKEND_API_URL}/academic-years/${academicYearId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success === false) {
      return {
        success: false,
        message: result?.message || "Failed to delete academic year",
        statusCode: response.status,
      };
    }

    revalidateTag("academic-years", { expire: 0 });
    revalidateTag("semesters", { expire: 0 });
    revalidateTag("class-schedules", { expire: 0 });

    return {
      success: true,
      message: result?.message || "Academic year deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting academic year:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the academic year.",
      statusCode: 500,
    };
  }
};

export const getAllAcademicYearsAction = async ({
  query,
}: {
  query?: AcademicYearQuery;
} = {}): Promise<AcademicYearResponse> => {
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
        data: null,
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/academic-years${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["academic-years"] },
      },
    );

    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch academic years",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Academic years fetched successfully",
      statusCode: response.status,
      data: result?.data?.data || null,
      meta: result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching academic years:", error);
    return {
      success: false,
      message: "An error occurred while fetching academic years",
      statusCode: 500,
      data: null,
    };
  }
};
