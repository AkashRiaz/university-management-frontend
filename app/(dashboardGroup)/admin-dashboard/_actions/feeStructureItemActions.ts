"use server";

import { CreateFeeStructureItemZodSchema } from "@/components/validations/fee-structure-item.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IFeeStructureItem } from "@/types/fee-structure-item.type";

type FeeStructureItemQuery = {
  [key: string]: string | string[] | undefined;
};

export type FeeStructureItemActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IFeeStructureItem | null;
};

export type FeeStructureItemResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IFeeStructureItem[] | null;
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

const getFeeStructureItemPayload = (formData: FormData) => ({
  feeStructureId: formData.get("feeStructureId"),
  name: formData.get("name"),
  description: formData.get("description") || undefined,
  amount: formData.get("amount"),
});

export const createFeeStructureItemAction = async (
  _previousState: FeeStructureItemActionState | null,
  formData: FormData,
): Promise<FeeStructureItemActionState> => {
  const validation = CreateFeeStructureItemZodSchema.safeParse(
    getFeeStructureItemPayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid fee structure item information",
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
      `${process.env.BACKEND_API_URL}/fee-structure-items`,
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
        message: result?.message || "Failed to create fee structure item",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Fee structure item created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating fee structure item:", error);
    return {
      success: false,
      message: "Something went wrong while creating the fee structure item.",
      statusCode: 500,
    };
  }
};

export const updateFeeStructureItemAction = async (
  _previousState: FeeStructureItemActionState | null,
  formData: FormData,
): Promise<FeeStructureItemActionState> => {
  const itemId = formData.get("id");
  const validation = CreateFeeStructureItemZodSchema.safeParse(
    getFeeStructureItemPayload(formData),
  );

  if (!itemId || typeof itemId !== "string") {
    return {
      success: false,
      message: "Fee structure item ID is required to update an item.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid fee structure item information",
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
      `${process.env.BACKEND_API_URL}/fee-structure-items/${itemId}`,
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
        message: result?.message || "Failed to update fee structure item",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Fee structure item updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating fee structure item:", error);
    return {
      success: false,
      message: "Something went wrong while updating the fee structure item.",
      statusCode: 500,
    };
  }
};

export const deleteFeeStructureItemAction = async (
  itemId: string,
): Promise<Omit<FeeStructureItemActionState, "data">> => {
  if (!itemId) {
    return {
      success: false,
      message: "Fee structure item ID is required to delete an item.",
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
      `${process.env.BACKEND_API_URL}/fee-structure-items/${itemId}`,
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
        message: result?.message || "Failed to delete fee structure item",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Fee structure item deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting fee structure item:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the fee structure item.",
      statusCode: 500,
    };
  }
};

export const getFeeStructureItemsByFeeStructureAction = async (
  feeStructureId: string,
  { query }: { query?: FeeStructureItemQuery } = {},
): Promise<FeeStructureItemResponse> => {
  if (!feeStructureId) {
    return {
      success: false,
      message: "Fee structure ID is required to fetch items.",
      statusCode: 400,
      data: null,
    };
  }

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
      `${process.env.BACKEND_API_URL}/fee-structure-items/fee-structure/${feeStructureId}${queryString ? `?${queryString}` : ""}`,
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
        message: result?.message || "Failed to fetch fee structure items",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Fee structure items fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching fee structure items:", error);
    return {
      success: false,
      message: "An error occurred while fetching fee structure items",
      statusCode: 500,
      data: null,
    };
  }
};
