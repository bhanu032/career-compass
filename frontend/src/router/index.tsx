import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { BookmarksPage } from "@/pages/BookmarksPage";
import { HomePage } from "@/pages/HomePage";
import { JobDetailsPage } from "@/pages/JobDetailsPage";
import { JobsPage } from "@/pages/JobsPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RegisterPage } from "@/pages/RegisterPage";
import { SearchPage } from "@/pages/SearchPage";
import { AdminDashboardPage } from "@/pages/admin/DashboardPage";
import { AdminJobsPage } from "@/pages/admin/JobsPage";
import { AdminScrapersPage } from "@/pages/admin/ScrapersPage";
import { AdminUsersPage } from "@/pages/admin/UsersPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/jobs", element: <JobsPage /> },
      { path: "/jobs/:id", element: <JobDetailsPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile", element: <ProfilePage /> },
          { path: "/bookmarks", element: <BookmarksPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    element: <ProtectedRoute requireAdmin />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <AdminDashboardPage /> },
          { path: "/admin/jobs", element: <AdminJobsPage /> },
          { path: "/admin/users", element: <AdminUsersPage /> },
          { path: "/admin/scrapers", element: <AdminScrapersPage /> },
        ],
      },
    ],
  },
]);
