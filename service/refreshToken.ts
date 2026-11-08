"use server";

import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

export type RefreshTokenResponse = {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
  };
};

const isJwt = (value: string) =>
  /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);

export const getNewAccessToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore
      .get("refreshToken")
      ?.value.replace(/^Bearer\s+/i, "");

    if (!refreshToken || !isJwt(refreshToken)) {
      return { success: false, message: "Refresh token is invalid" };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
        cache: "no-store",
      },
    );
    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Failed to refresh access token",
      };
    }

    const accessToken = result?.data?.accessToken;
    const newRefreshToken = result?.data?.refreshToken;
    if (typeof accessToken !== "string" || !isJwt(accessToken)) {
      return {
        success: false,
        message: "Refresh endpoint returned an invalid access token",
      };
    }

    if (typeof newRefreshToken === "string" && isJwt(newRefreshToken)) {
      cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return {
      success: true,
      message: result.message,
      data: { accessToken },
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      success: false,
      message: "An error occurred while refreshing the access token",
    };
  }
};

export const isAccessTokenExist = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  let accessToken =
    cookieStore.get("accessToken")?.value.replace(/^Bearer\s+/i, "") || null;
  const refreshToken =
    cookieStore.get("refreshToken")?.value.replace(/^Bearer\s+/i, "") || null;

  if (!accessToken && !refreshToken) return null;

  const decodedAccessToken =
    accessToken && isJwt(accessToken)
      ? jwtUtils.verifyToken(
          accessToken,
          process.env.JWT_ACCESS_SECRET as string,
        )
      : null;

  if (decodedAccessToken?.success) return accessToken;

  const decodedRefreshToken =
    refreshToken && isJwt(refreshToken)
      ? jwtUtils.verifyToken(
          refreshToken,
          process.env.JWT_REFRESH_SECRET as string,
        )
      : null;

  if (!decodedRefreshToken?.success) {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return null;
  }

  const result = await getNewAccessToken();
  const newAccessToken = result.data?.accessToken;

  if (!result.success || !newAccessToken) {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return null;
  }

  cookieStore.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  accessToken = newAccessToken;
  return accessToken;
};
