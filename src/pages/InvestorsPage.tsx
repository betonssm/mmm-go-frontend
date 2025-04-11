
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // подключение CSS

export default function InvestorsPage() {
  const navigate = useNavigate();

  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);
  const [payingInvestors, setPayingInvestors] = useState<number | null>(null);
  const [referrals, setReferrals] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setTotalPlayers(5000);
    setPayingInvestors(1500);
    setReferrals(350);
  };

  return (
    <div
      className="investors-page"
      style={{ backgroundImage: `url(/assets/bg-investors.png)` }}
    >
      <div className="investors-scroll-wrapper">
      <h2 className="section-title">📊 Вкладчики</h2>

      <div className="info-block">
        <h3>Общее количество игроков</h3>
        <p>
          Всего зарегистрировано игроков: <strong>{totalPlayers ?? "Загрузка..."}</strong>
        </p>
      </div>

      <div className="info-block">
        <h3>Инвесторы с платной подпиской</h3>
        <p>
          Участвуют в распределении: <strong>{payingInvestors ?? "Загрузка..."}</strong>
        </p>
      </div>

      <div className="info-block">
        <h3>Рефералы</h3>
        <p>
          Привлечено: <strong>{referrals ?? "Загрузка..."}</strong>
        </p>
      </div>

      <button onClick={() => navigate("/")} className="back-button">
        🔙 Назад
      </button>
    </div>
    </div>
  );
}