import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserRole, getRoleDashboardPath, type UserRole } from "./roles";

/**
 * Retrieves the currently authenticated Supabase user and their role on the server.
 */
export async function getCurrentUserWithRole() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, role: null };
  }

  const role = getUserRole(user);
  return { user, role };
}

/**
 * Server Component / Action guard that enforces authentication and required roles.
 */
export async function requireAuth(allowedRoles?: UserRole[]) {
  const { user, role } = await getCurrentUserWithRole();

  if (!user || !role) {
    redirect("/auth/sign-in");
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    redirect(getRoleDashboardPath(role));
  }

  return { user, role };
}
