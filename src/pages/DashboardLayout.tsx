
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Боковое меню */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-yellow-600 mb-6">MMM GO Admin</h2>
        <nav className="space-y-4">
          <Link
            to="/admin"
            className={`block px-4 py-2 rounded ${isActive("/admin") ? "bg-yellow-100 font-semibold" : "hover:bg-gray-100"}`}
          >
            📊 Игроки
          </Link>
          <Link
            to="/admin/logs"
            className={`block px-4 py-2 rounded ${isActive("/admin/logs") ? "bg-yellow-100 font-semibold" : "hover:bg-gray-100"}`}
          >
            📜 Журнал
          </Link>
        </nav>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}



       
