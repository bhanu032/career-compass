import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children?: ReactNode;
  requireAdmin?: boolean;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false, adminOnly = false }: ProtectedRouteProps): JSX.Element {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container-page py-24 text-center text-sm text-slate-500">Checking your session…</div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if ((requireAdmin || adminOnly) && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}
