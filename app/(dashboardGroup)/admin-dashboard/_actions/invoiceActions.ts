"use server";

import { revalidateTag } from "next/cache";
import {
  createInvoiceZodSchema,
  updateInvoiceZodSchema,
} from "@/components/validations/invoice.validation";
import { isAccessTokenExist } from "@/service/refreshToken";
import { IInvoice } from "@/types/invoice.type";

type InvoiceQuery = { [key: string]: string | string[] | undefined };

export type InvoiceActionState = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IInvoice | null;
};

export type InvoiceResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: IInvoice[] | null;
  meta?: { page: number; limit: number; total: number; totalPages: number } | null;
};

const getQueryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const getInvoicePayload = (formData: FormData) => ({
  studentId: formData.get("studentId"),
  semesterId: formData.get("semesterId"),
  dueDate: formData.get("dueDate"),
  discount: formData.get("discount")
    ? Number(formData.get("discount"))
    : undefined,
  tax: formData.get("tax") ? Number(formData.get("tax")) : undefined,
});

const saveInvoice = async (
  formData: FormData,
  method: "POST" | "PATCH",
): Promise<InvoiceActionState> => {
  revalidateTag("invoices", { expire: 0 });
  const invoiceId = formData.get("id");
  const validationSchema =
    method === "POST" ? createInvoiceZodSchema : updateInvoiceZodSchema;
  const validation = validationSchema.safeParse(
    getInvoicePayload(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Invalid invoice information",
      statusCode: 400,
    };
  }

  if (method === "PATCH" && (!invoiceId || typeof invoiceId !== "string")) {
    return {
      success: false,
      message: "Invoice ID is required to update an invoice",
      statusCode: 400,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return { success: false, message: "Access token not found", statusCode: 401 };
    }

    const endpoint =
      method === "POST"
        ? `${process.env.BACKEND_API_URL}/invoices`
        : `${process.env.BACKEND_API_URL}/invoices/${invoiceId}`;
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
          `Failed to ${method === "POST" ? "create" : "update"} invoice`,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message:
        result.message ||
        `Invoice ${method === "POST" ? "created" : "updated"} successfully`,
      statusCode: response.status,
      data: result.data || null,
    };
  } catch (error) {
    console.error(`Error ${method === "POST" ? "creating" : "updating"} invoice:`, error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      statusCode: 500,
    };
  }
};

export const createInvoiceAction = async (
  _previousState: InvoiceActionState | null,
  formData: FormData,
) => saveInvoice(formData, "POST");

export const updateInvoiceAction = async (
  _previousState: InvoiceActionState | null,
  formData: FormData,
) => saveInvoice(formData, "PATCH");

export const deleteInvoiceAction = async (
  invoiceId: string,
): Promise<Omit<InvoiceActionState, "data">> => {
  revalidateTag("invoices", { expire: 0 });
  if (!invoiceId) {
    return {
      success: false,
      message: "Invoice ID is required to delete an invoice",
      statusCode: 400,
    };
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return { success: false, message: "Access token not found", statusCode: 401 };
    }
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/invoices/${invoiceId}`,
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
        message: result?.message || "Failed to delete invoice",
        statusCode: response.status,
      };
    }
    return {
      success: true,
      message: result?.message || "Invoice deleted successfully",
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the invoice.",
      statusCode: 500,
    };
  }
};

export const getAllInvoicesAction = async ({
  query,
}: { query?: InvoiceQuery } = {}): Promise<InvoiceResponse> => {
  const params = new URLSearchParams();
  for (const key of ["searchTerm", "page", "limit", "studentId", "semesterId"]) {
    const value = getQueryValue(query?.[key]);
    if (value) params.set(key, value);
  }

  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return { success: false, message: "Access token not found", statusCode: 401, data: null };
    }
    const queryString = params.toString();
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/invoices${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "force-cache",
        next: { revalidate: 60 * 60, tags: ["invoices"] },
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch invoices",
        statusCode: response.status,
        data: null,
      };
    }
    return {
      success: true,
      message: "Invoices fetched successfully",
      statusCode: response.status,
      data: result.data?.data || result.data || null,
      meta: result.meta || result.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return {
      success: false,
      message: "An error occurred while fetching invoices",
      statusCode: 500,
      data: null,
    };
  }
};
