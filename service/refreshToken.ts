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

export const getNewAccessToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return {
        success: false,
        message: "Refresh token not found",
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to refresh access token",
      };
    }

    return result;
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
  let accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!accessToken && !refreshToken) {
    return null;
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  // Current access token is valid.
  if (decodedAccessToken?.success) {
    return accessToken;
  }

  const decodedRefreshToken = refreshToken
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

  // Refresh token is valid, request a new access token.
  const result = await getNewAccessToken();

  const newAccessToken = result?.data?.accessToken;

  if (!result?.success || !newAccessToken) {
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
