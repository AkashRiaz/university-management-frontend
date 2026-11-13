"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

type LoginState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    targetPath: string;
  } | null;
};

type verifyStudentState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Record<string, unknown> | null;
};

export type VerifyInstructorState = verifyStudentState;

const getAccessSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
};

const getDashboardPath = (role: unknown) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin-dashboard";
  }

  if (role === "INSTRUCTOR") {
    return "/instructor-dashboard";
  }

  if (role === "STUDENT") {
    return "/student-dashboard";
  }

  return "/home";
};

export const loginActions = async (
  _prevState: LoginState | null,
  formData: FormData,
): Promise<LoginState> => {
  const base = process.env.BACKEND_API_URL;
  if (!base) {
    throw new Error("BACKEND_API_URL is not defined in environment variables");
  }

  const response = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result?.success) {
    return result;
  }

  const accessToken = result.data?.accessToken;
  const refreshToken = result.data?.refreshToken;

  if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
    throw new Error("Login response did not contain valid tokens");
  }

  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    path: "/",
  });

  const { payload } = await jwtVerify(accessToken, getAccessSecret(), {
    algorithms: ["HS256"],
  });

  return {
    success: true,
    statusCode: result.statusCode ?? response.status,
    message: result.message ?? "Login successful",
    data: {
      targetPath: getDashboardPath(payload.role),
    },
  };
};

export const verifyStudentActions = async (
  prevState: verifyStudentState | null,
  formData: FormData,
): Promise<verifyStudentState | never> => {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  const payload = {
    email,
    otp,
  };

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/auth/verify-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json();

  if (!result?.success) {
    return result;
  }

  if (result?.success) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 1,
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      path: "/",
    });

    const { payload } = await jwtVerify(
      result.data.accessToken,
      getAccessSecret(),
      { algorithms: ["HS256"] },
    );

    redirect(getDashboardPath(payload.role));
  }

  redirect("/home");
};

export const resendStudentVerificationOtpAction = async (email: string) => {
  if (!email) return { success: false, message: "Email is required" };

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/students/resend-verification-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );
  const result = await response.json().catch(() => null);

  return {
    success: Boolean(response.ok && result?.success),
    message: result?.message || "Failed to resend verification code",
  };
};

export const verifyInstructorActions = async (
  _prevState: VerifyInstructorState | null,
  formData: FormData,
): Promise<VerifyInstructorState | never> => {
  const response = await fetch(
    `${process.env.BACKEND_API_URL}/instructors/verify-instructor-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        otp: formData.get("otp"),
      }),
    },
  );
  const result = await response.json();

  if (!result?.success) return result;

  const cookieStore = await cookies();
  cookieStore.set("accessToken", result.data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("refreshToken", result.data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    path: "/",
  });

  redirect("/instructor-dashboard");
};

export const resendInstructorVerificationOtpAction = async (email: string) => {
  if (!email) return { success: false, message: "Email is required" };

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/instructors/resend-verification-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );
  const result = await response.json().catch(() => null);
  return {
    success: Boolean(response.ok && result?.success),
    message: result?.message || "Failed to resend verification code",
  };
};

export const logout = async (): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};
