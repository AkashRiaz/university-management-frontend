"use server";

import { isAccessTokenExist } from "@/service/refreshToken";
import { AdminDashboardOverviewResponse, StudentDashboardOverviewResponse } from "@/types/dashboard.type";

export const getAdminDashboardOverviewAction =
  async (): Promise<AdminDashboardOverviewResponse> => {
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
        `${process.env.BACKEND_API_URL}/dashboard/admin/overview`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${accessToken}`,
          },

          cache: "no-store",
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        return {
          success: false,
          message:
            result?.message || "Failed to fetch admin dashboard overview",
          statusCode: response.status,
          data: null,
        };
      }

      return {
        success: true,
        message:
          result?.message || "Admin dashboard overview fetched successfully",
        statusCode: response.status,
        data: result?.data || null,
      };
    } catch (error) {
      console.error("Error fetching admin dashboard overview:", error);

      return {
        success: false,
        message: "Something went wrong while fetching dashboard overview.",
        statusCode: 500,
        data: null,
      };
    }
  };

export const getStudentDashboardOverviewAction =
  async (): Promise<StudentDashboardOverviewResponse> => {
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
        `${process.env.BACKEND_API_URL}/dashboard/student/overview`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${accessToken}`,
          },

          cache: "no-store",
        },
      );

      const result = await response.json().catch(() => null);
      console.log("Student Dashboard Overview Result:", result);

      if (!response.ok || !result?.success) {
        return {
          success: false,
          message:
            result?.message || "Failed to fetch student dashboard overview",
          statusCode: response.status,
          data: null,
        };
      }

      return {
        success: true,
        message:
          result?.message || "Student dashboard overview fetched successfully",
        statusCode: response.status,
        data: result?.data || null,
      };
    } catch (error) {
      console.error("Error fetching student dashboard overview:", error);

      return {
        success: false,
        message:
          "Something went wrong while fetching student dashboard overview.",
        statusCode: 500,
        data: null,
      };
    }
  };
