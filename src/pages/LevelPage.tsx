
import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // Подключаем общий стиль

export default function LevelPage() {
  const navigate = useNavigate();

  const levels = [
    { id: 1, name: "Новичок", required: "0" },
    { id: 2, name: "Подающий надежды", required: "50 000" },
    { id: 3, name: "Местный вкладчик", required: "150 000" },
    { id: 4, name: "Серьёзный игрок", required: "300 000" },
    { id: 5, name: "Опытный инвестор", required: "600 000" },
    { id: 6, name: "Финансовый магнат", required: "1 000 000" },
    { id: 7, name: "Серый кардинал", required: "2 000 000" },
    { id: 8, name: "Тайный куратор", required: "5 000 000" },
    { id: 9, name: "Легенда MMMGO", required: "10 000 000" },
  ];

  return (
    <div
      className="level-page"
      style={{
        backgroundImage: `url(/assets/bg-levels.png)`, // Файл нужно поместить в public/assets
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "30px 16px 60px",
        minHeight: "100vh",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <h2 className="section-title">📶 Уровни игрока</h2>

      <div className="levels-list">
        {levels.map((level) => (
          <div className="level-block" key={level.id}>
            <h3>{level.id}. {level.name}</h3>
            <p>Необходимо: <strong>{level.required}</strong> мавродиков</p>
          </div>
        ))}
      </div>

      <button className="back-button" onClick={() => navigate("/")}>
        🔙 Назад
      </button>
    </div>
  );
}