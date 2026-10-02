"use server";
import { revalidateTag } from "next/cache";

import {
  createInvoiceItemZodSchema,
  updateInvoiceItemZodSchema,
} from "@/components/validations/invoice-item.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IInvoiceItem } from "@/types/invoice-item.type";

type InvoiceItemQuery = {
  [key: string]: string | string[] | undefined;
};

export type InvoiceItemActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IInvoiceItem | null;
};

export type InvoiceItemResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IInvoiceItem[] | null;
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

const getInvoiceItemPayload = (formData: FormData) => ({
  invoiceId: formData.get("invoiceId"),
  name: formData.get("name"),
  description: formData.get("description") || undefined,
  quantity: formData.get("quantity")
    ? Number(formData.get("quantity"))
    : undefined,
  unitPrice: Number(formData.get("unitPrice")),
});

export const createInvoiceItemAction = async (
  _previousState: InvoiceItemActionState | null,
  formData: FormData,
): Promise<InvoiceItemActionState> => {
  revalidateTag("invoice-items", { expire: 0 });
  const validation = createInvoiceItemZodSchema.safeParse(
    getInvoiceItemPayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid invoice item information",
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
      `${process.env.BACKEND_API_URL}/invoice-items`,
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
        message: result?.message || "Failed to create invoice item",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Invoice item created successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating invoice item:", error);
    return {
      success: false,
      message: "Something went wrong while creating the invoice item.",
      statusCode: 500,
    };
  }
};

export const updateInvoiceItemAction = async (
  _previousState: InvoiceItemActionState | null,
  formData: FormData,
): Promise<InvoiceItemActionState> => {
  revalidateTag("invoice-items", { expire: 0 });
  const itemId = formData.get("id");
  const validation = updateInvoiceItemZodSchema.safeParse(
    getInvoiceItemPayload(formData),
  );

  if (!itemId || typeof itemId !== "string") {
    return {
      success: false,
      message: "Invoice item ID is required to update an item.",
      statusCode: 400,
    };
  }

  if (!validation.success) {
    return {
      success: false,
      message:
        validation.error.issues[0]?.message ||
        "Invalid invoice item information",
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
      `${process.env.BACKEND_API_URL}/invoice-items/${itemId}`,
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
        message: result?.message || "Failed to update invoice item",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Invoice item updated successfully",
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating invoice item:", error);
    return {
      success: false,
      message: "Something went wrong while updating the invoice item.",
      statusCode: 500,
    };
  }
};

export const deleteInvoiceItemAction = async (
  itemId: string,
): Promise<Omit<InvoiceItemActionState, "data">> => {
  revalidateTag("invoice-items", { expire: 0 });
  if (!itemId) {
    return {
      success: false,
      message: "Invoice item ID is required to delete an item.",
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
      `${process.env.BACKEND_API_URL}/invoice-items/${itemId}`,
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
        message: result?.message || "Failed to delete invoice item",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || "Invoice item deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting invoice item:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the invoice item.",
      statusCode: 500,
    };
  }
};

export const getInvoiceItemsByInvoiceAction = async (
  invoiceId: string,
  { query }: { query?: InvoiceItemQuery } = {},
): Promise<InvoiceItemResponse> => {
  if (!invoiceId) {
    return {
      success: false,
      message: "Invoice ID is required to fetch items.",
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
      `${process.env.BACKEND_API_URL}/invoice-items/invoice/${invoiceId}${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["invoice-items"] },
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch invoice items",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: "Invoice items fetched successfully",
      statusCode: response.status,
      data: Array.isArray(result?.data)
        ? result.data
        : result?.data?.data || null,
      meta: result?.meta || result?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching invoice items:", error);
    return {
      success: false,
      message: "An error occurred while fetching invoice items",
      statusCode: 500,
      data: null,
    };
  }
};

export const getAllInvoiceItemsAction = getInvoiceItemsByInvoiceAction;
