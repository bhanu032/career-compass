import { Briefcase, LayoutDashboard, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { classNames } from "@/utils/format";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase, end: false },
  { to: "/admin/users", label: "Users", icon: Users, end: false },
];

export function AdminLayout(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container-page flex flex-1 flex-col gap-6 py-8 lg:flex-row">
        <nav className="card h-fit p-3 lg:w-56">
          <ul className="flex gap-1 lg:flex-col">
            {NAV.map((item) => (
              <li key={item.to} className="flex-1">
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    classNames(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-brand-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
