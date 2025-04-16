
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // Убедитесь, что стили подключены правильно

export default function RulesPage() {
  const navigate = useNavigate();
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/bg-rules.png";
    img.onload = () => setBgLoaded(true);
  }, []);

  if (!bgLoaded) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return (
    <div
      className="rules-page-container"
      style={{
        backgroundImage: `url(/assets/bg-rules.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        paddingTop: "30px",
        paddingBottom: "30px",
        padding: "0 20px",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000", marginBottom: "20px" }}>
  📜 Правила игры MMM GO
</h2>

<div style={{
  marginBottom: "20px",
  padding: "15px",
  background: "rgba(0, 0, 0, 0.6)",
  borderRadius: "12px",
}}>
  <ul style={{ color: "#ffe082", listStyleType: "disc", paddingLeft: "20px" }}>
    <li><strong>MMM GO</strong> — это WebApp-игра в ретро-стиле 90-х, вдохновлённая эстетикой того времени.</li>
    <li>В игре используется внутриигровая валюта — <strong>мавродики</strong>, которые добываются через активность.</li>
    <li>Достигнув высокого уровня, игрок может обменивать мавродики на внутриигровой токен <strong>MMMGO</strong>.</li>
    <li>Подписка даёт дополнительные бонусы, но не является обязательной — весь контент доступен без вложений.</li>
    <li>Разделение фонда среди активных игроков происходит как внутриигровой рейтинг и не связано с гарантированным доходом.</li>
    <li>Все персонажи, названия и механики являются вымышленными и служат только для игрового процесса.</li>
  </ul>
</div>

<p style={{ color: "#ffe082", textAlign: "center", marginBottom: "20px" }}>
  💬 Это игра, а не финансовый инструмент. Никаких инвестиций, гарантий дохода или обещаний прибыли не предусмотрено.
</p>
<p style={{ color: "#ffe082", textAlign: "center", marginBottom: "30px" }}>
  🔗 <a href="https://example.com/rules" target="_blank" rel="noopener noreferrer" style={{ color: "#ffe082", textDecoration: "underline" }}>
    Читать полные правила
  </a>
</p>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "24px",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "12px",
          background: "linear-gradient(to bottom, #ffe259, #ffa751)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 0 10px #ffca28",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Принять
      </button>
    </div>
  );
}