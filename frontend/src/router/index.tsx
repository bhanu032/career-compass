import { createBrowserRouter, Navigate } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { AdmitCardDetailPage } from "@/pages/AdmitCardDetailPage";
import { AdmitCardsPage } from "@/pages/AdmitCardsPage";
import { BookmarksPage } from "@/pages/BookmarksPage";
import { HomePage } from "@/pages/HomePage";
import { JobDetailsPage } from "@/pages/JobDetailsPage";
import { JobsPage } from "@/pages/JobsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ResultDetailPage } from "@/pages/ResultDetailPage";
import { ResultsPage } from "@/pages/ResultsPage";
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
      { path: "/admit-cards", element: <AdmitCardsPage /> },
      { path: "/admit-cards/:id", element: <AdmitCardDetailPage /> },
      { path: "/results", element: <ResultsPage /> },
      { path: "/results/:id", element: <ResultDetailPage /> },
      { path: "/search", element: <SearchPage /> },
      // Redirect old auth routes to home — login/register are removed
      { path: "/login",    element: <Navigate to="/" replace /> },
      { path: "/register", element: <Navigate to="/" replace /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile",   element: <ProfilePage /> },
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
          { path: "/admin",          element: <AdminDashboardPage /> },
          { path: "/admin/jobs",     element: <AdminJobsPage /> },
          { path: "/admin/users",    element: <AdminUsersPage /> },
          { path: "/admin/scrapers", element: <AdminScrapersPage /> },
        ],
      },
    ],
  },
]);
