
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!token) return alert("Введите токен");
    localStorage.setItem("adminToken", token);
    navigate("/admin");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>🔐 Вход в админку MMM GO</h2>
      <input
        type="password"
        placeholder="Введите admin токен"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", width: "300px" }}
      />
      <br /><br />
      <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Войти
      </button>
    </div>
  );
}



       
