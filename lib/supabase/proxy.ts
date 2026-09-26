import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_ROUTES } from "../constants";

type RedirectCounter = {
  count: number;
  paths: string[];
};

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export async function updateSession(request: NextRequest) {
  const redirectStats: RedirectCounter = {
    count: 0,
    paths: [],
  };

  const response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: CookieToSet[]) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh user data
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const emailVerified = user?.identities?.[0]?.identity_data?.email_verified;

  const userRole = (user?.app_metadata?.role ||
    user?.user_metadata?.role ||
    "user") as "user" | "vendor" | "admin";

  const roleDashboard =
    userRole === "admin"
      ? "/admin/dashboard"
      : userRole === "vendor"
      ? "/vendor/dashboard"
      : "/user/dashboard";

  // Helper function for redirection with tracking
  const redirect = (path: string): NextResponse => {
    redirectStats.count++;
    redirectStats.paths.push(`${pathname} → ${path}`);

    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  // Skip protection for public routes like /instruments, static assets, etc.
  if (
    pathname === "/instruments" ||
    pathname.startsWith("/instruments/")
  ) {
    return response;
  }

  // Early return conditions to minimize redirects
  const isAuthRoute = pathname.startsWith("/auth/");
  const isProtectedRoute = PROTECTED_ROUTES.some((path) =>
    pathname.startsWith(path)
  );

  // Case 1: Verified users shouldn't access auth routes - send to their dashboard
  if (user && emailVerified && isAuthRoute) {
    return redirect(roleDashboard);
  }

  // Case 2: Unverified users should only access confirm-otp
  if (user && !emailVerified) {
    if ((isAuthRoute && pathname !== "/auth/confirm-otp") || isProtectedRoute) {
      return redirect("/auth/confirm-otp");
    }
  }

  // Case 3: Specific handling for confirm-otp page
  if (pathname === "/auth/confirm-otp") {
    if (!user) {
      return redirect("/auth/sign-in");
    }
    if (emailVerified) {
      return redirect(roleDashboard);
    }
  }

  // Case 4: Unauthenticated users accessing protected routes
  if (!user && isProtectedRoute) {
    // Store intended destination
    response.cookies.set("next_url", pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return redirect("/auth/sign-in");
  }

  // Case 5: Role-based route enforcement
  if (user) {
    // Admin routes protection: strictly requires admin role
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return redirect(roleDashboard);
    }

    // Vendor routes protection: requires vendor or admin role
    if (
      pathname.startsWith("/vendor") &&
      userRole !== "vendor" &&
      userRole !== "admin"
    ) {
      return redirect("/user/dashboard");
    }
  }

  // Add redirect statistics to response headers for debugging
  response.headers.set("X-Redirect-Count", redirectStats.count.toString());
  response.headers.set("X-Redirect-Paths", JSON.stringify(redirectStats.paths));

  return response;
}

export const createClient = updateSession;
