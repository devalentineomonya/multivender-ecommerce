import type { User } from "@supabase/supabase-js";

export type UserRole = "user" | "vendor" | "admin";

/**
 * Extracts the user role from Supabase auth user object.
 * Checks app_metadata first (set by admins/triggers), then user_metadata.
 */
export function getUserRole(user: User | null | undefined): UserRole {
  if (!user) return "user";

  const appRole = user.app_metadata?.role as UserRole | undefined;
  if (appRole && ["admin", "vendor", "user"].includes(appRole)) {
    return appRole;
  }

  const userRole = user.user_metadata?.role as UserRole | undefined;
  if (userRole && ["admin", "vendor", "user"].includes(userRole)) {
    return userRole;
  }

  return "user";
}

/**
 * Returns the destination dashboard path for a given role.
 */
export function getRoleDashboardPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "vendor":
      return "/vendor/dashboard";
    case "user":
    default:
      return "/user/dashboard";
  }
}
