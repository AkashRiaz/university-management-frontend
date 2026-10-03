import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./utils/jwt";
import { JwtPayload } from "jsonwebtoken";

const AUTH_ROUTES = ["/login", "/reset-password", "/verify-student", "/verify-instructor"];

const PUBLIC_ROUTES = ["/"];

type RefreshTokenResponse = {
  success?: boolean;
  data?: {
    accessToken?: string;
  };
  message?: string;
};

const getDashboardPath = (role: string | null) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin-dashboard";
  }
  if (role === "INSTRUCTOR") {
    return "/instructor-dashboard";
  }
  if (role === "STUDENT") {
    return "/student-dashboard";
  }

  return null;
};

const isMatchingRoute = (pathname: string, routes: string[]) => {
  return routes.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }

    return pathname === route || pathname.startsWith(`${route}/`);
  });
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const backendApiUrl = process.env.BACKEND_API_URL;

    if (!backendApiUrl) {
      console.error("BACKEND_API_URL is not configured");
      return null;
    }

    const response = await fetch(`${backendApiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    });

    const result = (await response
      .json()
      .catch(() => null)) as RefreshTokenResponse | null;

    const newAccessToken = result?.data?.accessToken;

    if (
      !response.ok ||
      !result?.success ||
      typeof newAccessToken !== "string" ||
      !newAccessToken.trim()
    ) {
      return null;
    }

    return newAccessToken;
  } catch (error) {
    console.error("Proxy token refresh error:", error);

    return null;
  }
};

const setAccessTokenCookie = (response: NextResponse, accessToken: string) => {
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
};

const clearAuthenticationCookies = (response: NextResponse) => {
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let accessToken = request.cookies.get("accessToken")?.value;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  const accessSecret = process.env.JWT_ACCESS_SECRET;

  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  let decodedAccessToken =
    accessToken && accessSecret
      ? jwtUtils.verifyToken(accessToken, accessSecret)
      : null;

  const decodedRefreshToken =
    refreshToken && refreshSecret
      ? jwtUtils.verifyToken(refreshToken, refreshSecret)
      : null;

  let refreshedAccessToken: string | null = null;

  let shouldClearCookies = false;

  /*
   * Access token expired or invalid,
   * but refresh token is still valid.
   */

  if (
    !decodedAccessToken?.success &&
    decodedRefreshToken?.success &&
    refreshToken
  ) {
    refreshedAccessToken = await refreshAccessToken(refreshToken);
  }

  if (refreshedAccessToken && accessSecret) {
    decodedAccessToken = jwtUtils.verifyToken(
      refreshedAccessToken,
      accessSecret,
    );
    accessToken = refreshedAccessToken;
    /*
     * Make the refreshed token available
     * to the current request.
     */
    request.cookies.set("accessToken", refreshedAccessToken);
  } else if (!decodedAccessToken?.success) {
    accessToken = undefined;
    decodedAccessToken = null;
    shouldClearCookies = true;
  }

  /*
   * Access token is invalid and no valid
   * refresh operation succeeded.
   */

  if (accessToken && !decodedAccessToken?.success) {
    accessToken = undefined;
    shouldClearCookies = true;
  }

  let userRole: string | null = null;

//   console.log("Decoded access token:", decodedAccessToken);

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role || null;
  }
//   console.log("User role:", userRole);

  const isPublicRoute = isMatchingRoute(pathname, PUBLIC_ROUTES);

  const isAuthRoute = isMatchingRoute(pathname, AUTH_ROUTES);

  let response: NextResponse;
  /*
   * Logged-in users should not revisit
   * login or registration pages.
   */
  if (accessToken && isAuthRoute) {
    const dashboardPath = getDashboardPath(userRole);

    if (dashboardPath) {
      response = NextResponse.redirect(new URL(dashboardPath, request.url));

      if (refreshedAccessToken) {
        setAccessTokenCookie(response, refreshedAccessToken);
      }

      return response;
    }
  }

  /*
   * Unauthenticated users attempting to
   * access a protected route.
   */
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "redirectTo",
      `${pathname}${request.nextUrl.search}`,
    );

    response = NextResponse.redirect(loginUrl);

    if (shouldClearCookies) {
      clearAuthenticationCookies(response);
    }

    return response;
  }

  /*
   * Role-based dashboard protection.
   */
  if (pathname.startsWith("/student-dashboard") && userRole !== "STUDENT") {
    response = NextResponse.redirect(new URL("/not-found", request.url));

    if (refreshedAccessToken) {
      setAccessTokenCookie(response, refreshedAccessToken);
    }

    return response;
  }

  if (
    pathname.startsWith("/admin-dashboard") &&
    userRole !== "ADMIN" &&
    userRole !== "SUPER_ADMIN"
  ) {
    response = NextResponse.redirect(new URL("/not-found", request.url));

    if (refreshedAccessToken) {
      setAccessTokenCookie(response, refreshedAccessToken);
    }

    return response;
  }

  if (
    pathname.startsWith("/instructor-dashboard") &&
    userRole !== "INSTRUCTOR"
  ) {
    response = NextResponse.redirect(new URL("/not-found", request.url));

    if (refreshedAccessToken) {
      setAccessTokenCookie(response, refreshedAccessToken);
    }

    return response;
  }

  response = NextResponse.next();

  /*
   * Send a successfully refreshed access
   * token back to the browser.
   */
  if (refreshedAccessToken) {
    setAccessTokenCookie(response, refreshedAccessToken);
  }

  if (shouldClearCookies) {
    clearAuthenticationCookies(response);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
