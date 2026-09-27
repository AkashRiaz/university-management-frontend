"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

type LoginState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  } | null;
};

type verifyStudentState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Record<string, unknown> | null;
};

export const loginActions = async (
  prevState: LoginState | null,
  formData: FormData,
): Promise<LoginState | never> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const payload = {
    email,
    password,
  };

  const response = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!result?.success) {
    return result;
  }

  if (result?.success) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1,
      sameSite: "lax",
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    // redirect outside try/catch
    const decodedToken = jwt.decode(result.data.accessToken);

    if (
      decodedToken &&
      typeof decodedToken === "object" &&
      "role" in decodedToken
    ) {
      const role = decodedToken.role;

      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        redirect("/admin-dashboard");
      }

      if (role === "INSTRUCTOR") {
        redirect("/instructor-dashboard");
      }

      if (role === "STUDENT") {
        redirect("/dashboard");
      }

      redirect("/home");
    }
  }

  redirect("/home");
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
      maxAge: 60 * 60 * 24 * 1,
      sameSite: "lax",
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    // redirect outside try/catch
    const decodedToken = jwt.decode(result.data.accessToken);

    if (
      decodedToken &&
      typeof decodedToken === "object" &&
      "role" in decodedToken
    ) {
      const role = decodedToken.role;

      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        redirect("/admin-dashboard");
      }

      if (role === "INSTRUCTOR") {
        redirect("/instructor-dashboard");
      }

      if (role === "STUDENT") {
        redirect("/dashboard");
      }

      redirect("/home");
    }
  }

  redirect("/home");
};
