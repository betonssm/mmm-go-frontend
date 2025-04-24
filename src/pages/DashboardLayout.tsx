
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4 flex-shrink-0">
        <h1 className="text-2xl font-bold mb-6">MMM GO Admin</h1>
        <nav className="flex flex-col gap-3">
          <NavLink
            to="/admin"
            className={({ isActive }) => isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-300"}
          >
            📊 Игроки
          </NavLink>
          <NavLink
            to="/admin/logs"
            className={({ isActive }) => isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-300"}
          >
            📜 Журнал
          </NavLink>
          <NavLink
            to="/admin/stats"
            className={({ isActive }) => isActive ? "text-yellow-400 font-semibold" : "hover:text-yellow-300"}
          >
            📈 Аналитика
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}


       
