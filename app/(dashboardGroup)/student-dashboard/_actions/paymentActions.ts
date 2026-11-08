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

const getAccessToken = async () => {
  const accessToken = await isAccessTokenExist();
  if (!accessToken) {
    return {
      success: false as const,
      message: "Access token not found",
      statusCode: 401,
    };
  }
  return { success: true as const, accessToken };
};

const fetchPaymentData = async (
  path: string,
  init: RequestInit = {},
): Promise<PaymentActionResponse> => {
  try {
    const auth = await getAccessToken();
    if (!auth.success) return auth;

    const response = await fetch(`${process.env.BACKEND_API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${auth.accessToken}`,
        ...init.headers,
      },
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to fetch payment data",
        statusCode: response.status,
        data: null,
      };
    }

    return {
      success: true,
      message: result.message || "Payment data fetched successfully",
      statusCode: response.status,
      data: result.data ?? null,
      meta: result.meta ?? null,
    };
  } catch (error) {
    console.error(`Error fetching payment data from ${path}:`, error);
    return {
      success: false,
      message: "Something went wrong while fetching payment data.",
      statusCode: 500,
      data: null,
    };
  }
};

export const createBkashPaymentAction = async (invoiceId: string) => {
  if (!invoiceId) {
    return { success: false, message: "Invoice is required", statusCode: 400 };
  }

  return fetchPaymentData("/payments/bkash/create", {
    method: "POST",
    body: JSON.stringify({ invoiceId }),
  });
};

export const getMyPaymentsAction = async () =>
  fetchPaymentData("/payments/my-payments");

export const getMyInvoicesAction = async (): Promise<PaymentActionResponse> => {
  const response = await fetchPaymentData("/invoices");
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
