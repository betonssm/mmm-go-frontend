
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // общий стиль
import bgRank from "../assets/bg-rank.png"; // путь к фону

export default function RankPage() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigate = useNavigate();

  // Пример данных
  const balance = 2500000;
  const level = Math.floor(balance / 1000000);
  const progress = (balance % 1000000) / 1000000;
  const totalPool = 5000000;

  useEffect(() => {
    const img = new Image();
    img.src = bgRank;
    img.onload = () => setBgLoaded(true);
  }, []);

  if (!bgLoaded) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(${bgRank})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "30px",
        paddingBottom: "30px",
      }}
    >
      <div
        style={{
          position: "relative",
          marginBottom: "20px",
          background: "rgba(255, 215, 0, 0.7)",
          color: "#000",
          fontSize: "18px",
          padding: "8px 15px",
          borderRadius: "12px",
          fontWeight: "bold",
          boxShadow: "0 0 10px #ffd700",
          zIndex: 10,
          textAlign: "center",
          maxWidth: "90%",
          margin: "0 auto",
        }}
      >
        <h3>Общий фонд на этот месяц: {totalPool} мавродиков</h3>
        <p>Этот пул разделяется среди топ 10% инвесторов</p>
      </div>

      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000", marginBottom: "8px" }}>
        🏅 Твой Инвесторский Ранг
      </h2>

      <p style={{ marginBottom: "8px", color: "#ffe082" }}>
        Ты уже инвестор уровня <strong>{level}</strong>!<br />
        А может, почти...
      </p>

      <p style={{ color: "#ffe082" }}>
        Чем больше у тебя мавродиков, тем выше твой статус.
        <br />
        Следующий ранг откроется при новом уровне 💸
      </p>

      <div
        style={{
          width: "100%",
          backgroundColor: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "10px",
            background: "linear-gradient(to right, #ffe259, #ffa751)",
            borderRadius: "10px",
          }}
        ></div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "rgba(0, 0, 0, 0.6)",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000" }}>📊 Ключевые принципы:</h3>
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          <li>
            <strong style={{ color: "#ffe082" }}>1. Фонд состоит из выплат от:</strong> инвестиций и дохода от рекламы
          </li>
          <li>
            <strong style={{ color: "#ffe082" }}>2. Фонд разделяется по итогам месяца среди топ </strong>10% инвесторов
          </li>
          <li>
            <strong style={{ color: "#ffe082" }}>3. Рейтинг инвесторов формируется исходя из количества баллов </strong>SR
          </li>
          <li>
            <strong style={{ color: "#ffe082" }}>
              4. Чтобы участвовать в разделе фонда, инвестор должен быть активен минимум:
            </strong>{" "}
            22 дня в месяц.
          </li>
        </ul>
      </div>

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
        🔙 Назад
      </button>
    </div>
  );
}