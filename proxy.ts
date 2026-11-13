import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const AUTH_ROUTES = [
  "/login",
  "/reset-password",
  "/verify-student",
  "/verify-instructor",
];

const PUBLIC_ROUTES = [
  "/",
  "/academics",
  "/departments",
  "/courses",
  "/programs",
  "/campus-life",
  "/about",
  "/admissions",
  "/research",
  "/semesters",
  "/credits",
];

type RefreshTokenResponse = {
  success?: boolean;
  data?: {
    accessToken?: string;
  };
  message?: string;
};

type AccessTokenPayload = JWTPayload & {
  role?: string;
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
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    expires: new Date(0),
    path: "/",
  };

  response.cookies.set("accessToken", "", options);
  response.cookies.set("refreshToken", "", options);
};

const verifyToken = async (
  token: string,
  secret: string | undefined,
  tokenType: string,
): Promise<AccessTokenPayload | null> => {
  if (!secret) {
    console.error(`${tokenType} secret is not configured`);
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] },
    );

    return payload;
  } catch (error) {
    console.error(`${tokenType} verification failed:`, error);
    return null;
  }
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let accessToken = request.cookies.get("accessToken")?.value;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? await verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET,
        "Access token",
      )
    : null;

  const decodedRefreshToken = refreshToken
    ? await verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        "Refresh token",
      )
    : null;

  let refreshedAccessToken: string | null = null;

  let shouldClearCookies = false;

  /*
   * Access token expired or invalid,
   * but refresh token is still valid.
   */

  if (!decodedAccessToken && decodedRefreshToken && refreshToken) {
    refreshedAccessToken = await refreshAccessToken(refreshToken);
  }

  if (refreshedAccessToken) {
    decodedAccessToken = await verifyToken(
      refreshedAccessToken,
      process.env.JWT_ACCESS_SECRET,
      "Access token",
    );
    accessToken = refreshedAccessToken;
    /*
     * Make the refreshed token available
     * to the current request.
     */
    request.cookies.set("accessToken", refreshedAccessToken);
  } else if (!decodedAccessToken) {
    accessToken = undefined;
    decodedAccessToken = null;
    shouldClearCookies = true;
  }

  /*
   * Access token is invalid and no valid
   * refresh operation succeeded.
   */

  if (accessToken && !decodedAccessToken) {
    accessToken = undefined;
    shouldClearCookies = true;
  }

  let userRole: string | null = null;

  //   console.log("Decoded access token:", decodedAccessToken);

  if (decodedAccessToken) {
    userRole = decodedAccessToken.role || null;
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
