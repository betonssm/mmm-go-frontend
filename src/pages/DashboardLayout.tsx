
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
    return (
      <div className="flex h-screen">
        <aside className="w-60 bg-gray-800 text-white p-4 space-y-4">
          <h1 className="text-2xl font-bold">MMM GO Admin</h1>
          <nav className="flex flex-col space-y-2">
            <NavLink to="/admin"
  className={({ isActive }) =>
    `px-2 py-1 rounded ${
      isActive ? "bg-white text-gray-800 font-semibold" : "hover:underline"
    }`
  }
>📊 Игроки</NavLink>
            <NavLink to="/admin/logs"
  className={({ isActive }) =>
    `px-2 py-1 rounded ${
      isActive ? "bg-white text-gray-800 font-semibold" : "hover:underline"
    }`
  }
>📜 Журнал</NavLink>
            <NavLink to="/stats"
  className={({ isActive }) =>
    `px-2 py-1 rounded ${
      isActive ? "bg-white text-gray-800 font-semibold" : "hover:underline"
    }`
  }
>📈 Аналитика</NavLink>
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    );
  }



       
