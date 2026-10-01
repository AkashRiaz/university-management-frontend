"use server";

import { CreateFeeStructureZodSchema } from "@/components/validations/fee-structure.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IFeeStructure } from "@/types/fee-structure.type";

type FeeStructureQuery = {
  [key: string]: string | string[] | undefined;
};

export type FeeStructureActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IFeeStructure | null;
};

export type FeeStructureResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IFeeStructure[] | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

const getQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
};

const getFeeStructurePayload = (formData: FormData) => ({
  name: formData.get("name"),
  description: formData.get("description") || undefined,
  programId: formData.get("programId") || undefined,
  semesterId: formData.get("semesterId") || undefined,
});

export const createFeeStructureAction = async (
  _previousState: FeeStructureActionState | null,
  formData: FormData,
): Promise<FeeStructureActionState> => {
  const validation = CreateFeeStructureZodSchema.safeParse(
    getFeeStructurePayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid fee structure information",
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
      `${process.env.BACKEND_API_URL}/fee-structures`,
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
        message: result?.message || "Failed to create fee structure",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Fee structure created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating fee structure:", error);
    return {
      success: false,
      message: "Something went wrong while creating the fee structure.",
      statusCode: 500,
    };
  }
};

export const updateFeeStructureAction = async (
  _previousState: FeeStructureActionState | null,
  formData: FormData,
): Promise<FeeStructureActionState> => {
  const feeStructureId = formData.get("id");
  const validation = CreateFeeStructureZodSchema.safeParse(
    getFeeStructurePayload(formData),
  );

  if (!feeStructureId || typeof feeStructureId !== "string") {
    return {
      success: false,
      message: "Fee structure ID is required to update a fee structure.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid fee structure information",
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
      `${process.env.BACKEND_API_URL}/fee-structures/${feeStructureId}`,
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
        message: result?.message || "Failed to update fee structure",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Fee structure updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating fee structure:", error);
    return {
      success: false,
      message: "Something went wrong while updating the fee structure.",
      statusCode: 500,
    };
  }
};

export const deleteFeeStructureAction = async (
  feeStructureId: string,
): Promise<Omit<FeeStructureActionState, "data">> => {
  if (!feeStructureId) {
    return {
      success: false,
      message: "Fee structure ID is required to delete a fee structure.",
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
      `${process.env.BACKEND_API_URL}/fee-structures/${feeStructureId}`,
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
        message: result?.message || "Failed to delete fee structure",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Fee structure deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting fee structure:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the fee structure.",
      statusCode: 500,
    };
  }
};

export const getAllFeeStructuresAction = async ({
  query,
}: { query?: FeeStructureQuery } = {}): Promise<FeeStructureResponse> => {
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
      `${process.env.BACKEND_API_URL}/fee-structures${queryString ? `?${queryString}` : ""}`,
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
        message: result?.message || "Failed to fetch fee structures",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Fee structures fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching fee structures:", error);
    return {
      success: false,
      message: "An error occurred while fetching fee structures",
      statusCode: 500,
      data: null,
    };
  }
};
