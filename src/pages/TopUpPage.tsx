
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css"; // Подключаем стили

export default function TopUpPage() {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/bg-topup.png"; // Убедись, что файл есть в public/assets
    img.onload = () => setBgLoaded(true);
  }, []);

  if (!bgLoaded) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return (
    <div className="topup-container"
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
      <h1>Пополнение баланса</h1>
      <p>Выберите удобный способ оплаты:</p>

      <div className="payment-options">
        <div className="payment-option">
          <h3>🪙 Plisio</h3>
          <p>Оплата в криптовалюте (USDT, BTC и другие)</p>
          <Link to="/pay/plisio">
            <button>Оплатить через Plisio</button>
          </Link>
        </div>
      </div>

      <p className="note">
        💡 Перед оплатой убедитесь, что у вас достаточно средств на кошельке для покрытия комиссии.
      </p>

      <Link to="/">
        <button className="back-btn">⬅ Вернуться назад</button>
      </Link>
    </div>
  );
}