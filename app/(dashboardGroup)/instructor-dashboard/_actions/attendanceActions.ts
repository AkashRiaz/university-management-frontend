"use server";

import { revalidateTag } from "next/cache";
import { isAccessTokenExist } from "@/service/refreshToken";
import type { InstructorSection } from "./sectionActions";

export type AttendanceSession = {
  id: string;
  date: string;
  topic?: string | null;
  sectionId: string;
  _count?: { records?: number };
  section?: InstructorSection["section"];
};

export type AttendanceStudent = {
  id: string;
  student?: {
    id?: string;
    user?: { name?: string; email?: string };
    rollNumber?: string | null;
  };
  attendanceRecord?: {
    id?: string;
    status?: string;
    remarks?: string | null;
  } | null;
};

export type AttendanceActionState<T = unknown> = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: T | null;
};

const attendanceRequest = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<AttendanceActionState<T>> => {
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

    const response = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Attendance request failed",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: result.message || "Attendance request completed successfully",
      statusCode: response.status,
      data: Array.isArray(result.data)
        ? result.data
        : result.data?.data ?? result.data ?? null,
    };
  } catch (error) {
    console.error(`Attendance request failed for ${path}:`, error);
    return {
      success: false,
      message: "Something went wrong with the attendance request.",
      statusCode: 500,
      data: null,
    };
  }
};

export const getAttendanceSessionsAction = async (sectionId: string) =>
  attendanceRequest<AttendanceSession[]>(
    `/attendance-sessions/section/${sectionId}`,
  );

export const createAttendanceSessionAction = async (
  _previousState: AttendanceActionState<AttendanceSession> | null,
  formData: FormData,
) => {
  const sectionId = formData.get("sectionId");
  const date = formData.get("date");
  const topic = formData.get("topic");

  if (typeof sectionId !== "string" || typeof date !== "string" || !date) {
    return {
      success: false,
      message: "Section and date are required.",
      statusCode: 400,
    };
  }

  const result = await attendanceRequest<AttendanceSession>(
    "/attendance-sessions",
    {
      method: "POST",
      body: JSON.stringify({
        sectionId,
        date,
        topic: typeof topic === "string" ? topic || undefined : undefined,
      }),
    },
  );

  if (result.success) {
    revalidateTag(`attendance-sessions-${sectionId}`, { expire: 0 });
  }

  return result;
};

export const getAttendanceStudentsAction = async (sessionId: string) =>
  attendanceRequest<AttendanceStudent[]>(
    `/attendance-records/session/${sessionId}/students`,
  );

export const saveAttendanceAction = async (
  sessionId: string,
  records: Array<{
    courseRegistrationId: string;
    status: string;
    remarks?: string;
  }>,
) => {
  const result = await attendanceRequest("/attendance-records/bulk", {
    method: "POST",
    body: JSON.stringify({ sessionId, records }),
  });

  if (result.success) {
    revalidateTag(`attendance-students-${sessionId}`, { expire: 0 });
  }

  return result;
};
