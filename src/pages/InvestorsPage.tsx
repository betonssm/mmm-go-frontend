
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // правильный путь к стилям

export default function InvestorsPage() {
  const navigate = useNavigate();

  // Состояния для данных
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);
  const [payingInvestors, setPayingInvestors] = useState<number | null>(null);
  const [referrals, setReferrals] = useState<number | null>(null);

  // Эмуляция загрузки данных
  useEffect(() => {
    // Здесь можно добавить функции для получения данных с сервера
    fetchData();
  }, []);

  const fetchData = async () => {
    // Для примера данные
    setTotalPlayers(5000);  // Общее количество игроков
    setPayingInvestors(1500);  // Количество инвесторов с платной подпиской
    setReferrals(350);  // Количество рефералов
  };

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(/assets/bg-investors.png)`, // путь к фону
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "30px", // отступ сверху
        paddingBottom: "30px", // отступ снизу
      }}
    >
      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000", marginBottom: "20px" }}>
        📊 Вкладчики
      </h2>

      {/* Общее количество игроков */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "rgba(0, 0, 0, 0.6)",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ color: "#ffe082" }}>Общее количество игроков</h3>
        <p style={{ color: "#ffe082" }}>
          Всего зарегистрировано игроков: <strong>{totalPlayers ?? "Загрузка..."}</strong>
        </p>
      </div>

      {/* Количество инвесторов с платной подпиской */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "rgba(0, 0, 0, 0.6)",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ color: "#ffe082" }}>Инвесторы с платной подпиской</h3>
        <p style={{ color: "#ffe082" }}>
          Количество инвесторов, участвующих в распределении: <strong>{payingInvestors ?? "Загрузка..."}</strong>
        </p>
      </div>

      {/* Рефералы */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "rgba(0, 0, 0, 0.6)",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ color: "#ffe082" }}>Рефералы</h3>
        <p style={{ color: "#ffe082" }}>
          Количество рефералов, привлечённых вами: <strong>{referrals ?? "Загрузка..."}</strong>
        </p>
      </div>

      {/* Кнопка назад */}
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
          marginRight: "auto", // выравнивание кнопки по центру
        }}
      >
        🔙 Назад
      </button>
    </div>
  );
}