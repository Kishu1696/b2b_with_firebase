import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";

interface ProtectedRouteProps {
  /** If provided, only users with this role (or admin) may access the route. */
  role?: UserRole | UserRole[];
  /** Redirect target when unauthenticated. Defaults to /auth/login */
  redirectTo?: string;
}

/**
 * Wrap any <Route> element with this to enforce authentication and optional
 * role-based access control.
 *
 * @example
 * // Auth-only
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 *
 * // Role-restricted
 * <Route element={<ProtectedRoute role="admin" />}>
 *   <Route path="/admin" element={<AdminPanel />} />
 * </Route>
 */
export default function ProtectedRoute({
  role,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // While checking stored tokens on mount, show a skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Role check — admins bypass all role restrictions
  if (role && user) {
    const allowed = Array.isArray(role) ? role : [role];
    const hasRole = user.role === "admin" || allowed.includes(user.role);
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
