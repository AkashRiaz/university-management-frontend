"use server";

import { isAccessTokenExist } from "@/service/refreshToken";
import type { IInvoice } from "@/types/invoice.type";

type PaymentData = {
  id: string;
  paymentId?: string;
  transactionId?: string;
  paymentURL?: string;
  amount?: number | string;
  status?: string;
  invoiceId?: string;
};

export type PaymentActionResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: PaymentData[] | PaymentData | IInvoice[] | IInvoice | null;
  meta?: Record<string, number> | null;
};

const request = async (
  path: string,
  init: RequestInit = {},
): Promise<PaymentActionResponse> => {
  try {
    const accessToken = await isAccessTokenExist();
    if (!accessToken) {
      return { success: false, message: "Access token not found", statusCode: 401 };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Request failed",
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message || "Request completed successfully",
      statusCode: response.status,
      data: result.data ?? null,
      meta: result.meta ?? null,
    };
  } catch (error) {
    console.error(`Payment request failed for ${path}:`, error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      statusCode: 500,
    };
  }
};

export const createBkashPaymentAction = async (invoiceId: string) => {
  if (!invoiceId) {
    return { success: false, message: "Invoice is required", statusCode: 400 };
  }

  return request("/payments/bkash/create", {
    method: "POST",
    body: JSON.stringify({ invoiceId }),
  });
};

export const getMyPaymentsAction = async () => request("/payments/my-payments");

export const getMyInvoicesAction = async (): Promise<PaymentActionResponse> => {
  const response = await request("/invoices");
  if (!response.success || !response.data || Array.isArray(response.data)) {
    return response;
  }

  const data = response.data as {
    data?: IInvoice[];
    meta?: Record<string, number>;
  };

  return {
    ...response,
    data: data.data ?? [],
    meta: data.meta ?? response.meta ?? null,
  };
};
