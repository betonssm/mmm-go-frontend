
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css";

export default function TopUpPage() {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/bg-topup.png";
    img.onload = () => setBgLoaded(true);
  }, []);

  if (!bgLoaded) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return (
    <div
      className="topup-container"
      style={{
        backgroundImage: `url(/assets/bg-topup.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "30px 16px 60px",
        boxSizing: "border-box",
      }}
    >
      <h1>🎁 Премиум-доступ</h1>
      <p>Разблокируй расширенные возможности и бонусы!</p>

      <div className="payment-options">
        <div className="payment-option">
          <h3>🪙 Оплата через Plisio</h3>
          <p>Поддерживаются USDT, BTC, ETH и другие криптовалюты</p>
          <Link to="/pay/plisio">
            <button>🚀 Получить премиум</button>
          </Link>
        </div>
      </div>

      <p className="note">
        💡 Убедись, что на кошельке есть средства на оплату и комиссию сети.
      </p>
      <p className="note">
      💡 Платёж является добровольным. В MMM GO нет обещаний дохода или возврата средств.
      </p>
      <Link to="/">
        <button className="back-btn">⬅ Вернуться в игру</button>
      </Link>
    </div>
  );
}