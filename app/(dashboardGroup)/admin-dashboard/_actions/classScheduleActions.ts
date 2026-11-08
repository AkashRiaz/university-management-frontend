"use server";
import { revalidateTag } from "next/cache";

import { CreateClassScheduleZodSchema } from "@/components/validations/class-schedule.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IClassSchedule } from "@/types/class-schedule.type";

export type ClassScheduleActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IClassSchedule | null;
};

export type ClassScheduleResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IClassSchedule[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

type ClassScheduleQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const getClassSchedulePayload = (formData: FormData) => ({
  dayOfWeek: JSON.parse(String(formData.get("dayOfWeek") || "[]")),
  startTime: formData.get("startTime"),
  endTime: formData.get("endTime"),
  sectionId: formData.get("sectionId"),
  roomId: formData.get("roomId") || undefined,
  departmentId: formData.get("departmentId"),
});

export const createClassScheduleAction = async (
  _previousState: ClassScheduleActionState | null,
  formData: FormData,
): Promise<ClassScheduleActionState> => {
  const validation = CreateClassScheduleZodSchema.safeParse(
    getClassSchedulePayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid class schedule information",
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

    const results = await Promise.all(
      validation.data.dayOfWeek.map(async (dayOfWeek) => {
        const response = await fetch(
          `${process.env.BACKEND_API_URL}/class-schedules`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ ...validation.data, dayOfWeek }),
            cache: "no-store",
          },
        );
        return {
          response,
          result: await response.json().catch(() => null),
        };
      }),
    );
    const failedResult = results.find(
      ({ response, result }) => !response.ok || !result?.success,
    );

    if (failedResult) {
      return {
        success: false,
        message:
          failedResult.result?.message || "Failed to create class schedule",
        statusCode: failedResult.response.status,
      };
    }

    revalidateTag("class-schedules", { expire: 0 });

    return {
      success: true,
      message: `${validation.data.dayOfWeek.length} class schedule${validation.data.dayOfWeek.length === 1 ? "" : "s"} created successfully`,
      statusCode: 201,
      data: results[0]?.result?.data || null,
    };
  } catch (error) {
    console.error("Error creating class schedule:", error);
    return {
      success: false,
      message: "Something went wrong while creating the class schedule.",
      statusCode: 500,
    };
  }
};

export const updateClassScheduleAction = async (
  _previousState: ClassScheduleActionState | null,
  formData: FormData,
): Promise<ClassScheduleActionState> => {
  const scheduleId = formData.get("id");
  const validation = CreateClassScheduleZodSchema.safeParse(
    getClassSchedulePayload(formData),
  );

  if (!scheduleId || typeof scheduleId !== "string") {
    return {
      success: false,
      message: "Class schedule ID is required to update a schedule.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid class schedule information",
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
      `${process.env.BACKEND_API_URL}/class-schedules/${scheduleId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...validation.data,
          dayOfWeek: validation.data.dayOfWeek[0],
        }),
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to update class schedule",
        statusCode: response.status,
      };
    }

    revalidateTag("class-schedules", { expire: 0 });

    return {
      success: true,
      message: result.message || "Class schedule updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating class schedule:", error);
    return {
      success: false,
      message: "Something went wrong while updating the class schedule.",
      statusCode: 500,
    };
  }
};

export type ClassScheduleDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteClassScheduleAction = async (
  scheduleId: string,
): Promise<ClassScheduleDeleteState> => {
  if (!scheduleId) {
    return {
      success: false,
      message: "Class schedule ID is required to delete a schedule.",
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
      `${process.env.BACKEND_API_URL}/class-schedules/${scheduleId}`,
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
        message: result?.message || "Failed to delete class schedule",
        statusCode: response.status,
      };
    }

    revalidateTag("class-schedules", { expire: 0 });

    return {
      success: true,
      message: result?.message || "Class schedule deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting class schedule:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the class schedule.",
      statusCode: 500,
    };
  }
};

export const getAllClassSchedulesAction = async ({
  query,
}: { query?: ClassScheduleQuery } = {}): Promise<ClassScheduleResponse> => {
  const params = new URLSearchParams();
  const searchTerm = getQueryValue(query?.searchTerm);
  const page = getQueryValue(query?.page);
  const limit = getQueryValue(query?.limit);
  if (searchTerm) params.set("searchTerm", searchTerm);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

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

    const queryString = params.toString();
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/class-schedules${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "force-cache",
        next: {
          revalidate: 60 * 60,
          tags: ["class-schedules"],
        },
      },
    );
    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch class schedules",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Class schedules fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching class schedules:", error);
    return {
      success: false,
      message: "An error occurred while fetching class schedules",
      statusCode: 500,
      data: null,
    };
  }
};
