
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminLogs from "./AdminLogs";
import AdminStats from "./AdminStats";
import AdminSR from "./AdminSR";

export default function ProtectedAdmin({ page }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken") || "";

    if (!token) {
      setAuthorized(false);
      return;
    }

    fetch("https://mmmgo-backend.onrender.com/admin/overview", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 200) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })
      .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null) return <p>🔒 Проверка доступа...</p>;
  if (!authorized) {
    navigate("/admin-login");
    return null;
  }

  switch (page) {
    case "logs":
      return <AdminLogs />;
    case "stats":
      return <AdminStats />;
    case "sr":
      return <AdminSR />;
    default:
      return <AdminDashboard />;
  }
}