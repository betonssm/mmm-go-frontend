
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css"; // используем уже готовые классы

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <h2 className="admin-title">MMM GO Admin</h2>
        <button onClick={handleLogout} style={{ marginLeft: "auto" }}>
          🚪 Выйти
        </button>
        <nav className="admin-nav">
          <button onClick={() => navigate("/admin")}>📊 Игроки</button>
          <button onClick={() => navigate("/admin/logs")}>📜 Журнал</button>
          <button onClick={() => navigate("/admin/stats")}>📈 Аналитика</button>
          <button onClick={() => navigate("/admin/sr")}>🧮 SR Рейтинг</button>
        </nav>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}


       
