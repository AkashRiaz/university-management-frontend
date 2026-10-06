"use server";
import { revalidateTag } from "next/cache";

import { CreateCourseZodSchema } from "@/components/validations/course.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { ICourse } from "@/types/course.type";

export type CourseActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: ICourse | null;
};

export type CourseResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: ICourse[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

type CourseQuery = {
  [key: string]: string | string[] | undefined;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
};

const getCoursePayload = (formData: FormData) => ({
  code: formData.get("code"),
  title: formData.get("title"),
  description: formData.get("description") || "",
  credit: Number(formData.get("credit")),
  courseType: formData.get("courseType"),
  courseLevel: formData.get("courseLevel"),
  departmentId: formData.get("departmentId"),
});

export const createCourseAction = async (
  _previousState: CourseActionState | null,
  formData: FormData,
): Promise<CourseActionState> => {
  revalidateTag("courses", { expire: 0 });
  const validation = CreateCourseZodSchema.safeParse(
    getCoursePayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid course information",
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

    const response = await fetch(`${process.env.BACKEND_API_URL}/courses`, {
      method: "POST",
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
        message: result?.message || "Failed to create course",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Course created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      success: false,
      message: "Something went wrong while creating the course.",
      statusCode: 500,
    };
  }
};

export const updateCourseAction = async (
  _previousState: CourseActionState | null,
  formData: FormData,
): Promise<CourseActionState> => {
  revalidateTag("courses", { expire: 0 });
  const courseId = formData.get("id");
  const validation = CreateCourseZodSchema.safeParse(
    getCoursePayload(formData),
  );

  if (!courseId || typeof courseId !== "string") {
    return {
      success: false,
      message: "Course ID is required to update a course.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message || "Invalid course information",
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
      `${process.env.BACKEND_API_URL}/courses/${courseId}`,
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
        message: result?.message || "Failed to update course",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Course updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating course:", error);
    return {
      success: false,
      message: "Something went wrong while updating the course.",
      statusCode: 500,
    };
  }
};

export type CourseDeleteState = {
  success: boolean;
  message: string;
  statusCode?: number;
};

export const deleteCourseAction = async (
  courseId: string,
): Promise<CourseDeleteState> => {
  revalidateTag("courses", { expire: 0 });
  if (!courseId) {
    return {
      success: false,
      message: "Course ID is required to delete a course.",
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
      `${process.env.BACKEND_API_URL}/courses/${courseId}`,
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
        message: result?.message || "Failed to delete course",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Course deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting course:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the course.",
      statusCode: 500,
    };
  }
};

export const getAllCoursesAction = async ({
  query,
}: { query?: CourseQuery } = {}): Promise<CourseResponse> => {
  const params = new URLSearchParams();
  const searchTerm = getQueryValue(query?.searchTerm);
  const page = getQueryValue(query?.page);
  const limit = getQueryValue(query?.limit);

  if (searchTerm) params.set("searchTerm", searchTerm);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  try {
    const queryString = params.toString();
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/courses${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["courses"] },
      },
    );
    const result = await response.json();

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch courses",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Courses fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      success: false,
      message: "An error occurred while fetching courses",
      statusCode: 500,
      data: null,
    };
  }
};
