
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css";

export default function TopUpPage() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [isPremiumLoading, setPremiumLoading] = useState(false);
  const [isBuyLoading, setBuyLoading] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/bg-topup.png";
    img.onload = () => setBgLoaded(true);
      // ✅ Временная проверка Telegram API
  console.log("initData:", window.Telegram?.WebApp?.initData);
  console.log("initDataUnsafe:", window.Telegram?.WebApp?.initDataUnsafe);
  }, []);

  const handleSubscribe = () => {
    setPremiumLoading(true);
    window.Telegram?.WebApp?.sendData("subscribe");
    window.Telegram?.WebApp?.close(); // ✅ корректно!
  };

  const handleTopUp = () => {
    setBuyLoading(true);
    window.Telegram?.WebApp?.sendData("topup");
  };

  if (!bgLoaded) return <div className="loading-screen">Загрузка...</div>;

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
      {(isPremiumLoading || isBuyLoading) && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Обработка запроса...</p>
        </div>
      )}

      <div className="note-box">
        <h1>🎁 Премиум-доступ</h1>
        <p>Разблокируй расширенные возможности и бонусы!</p>
      </div>

      <div className="payment-options">
        <div className="payment-option">
          <button onClick={handleSubscribe} disabled={isPremiumLoading}>
            {isPremiumLoading ? "⏳ Ожидание..." : "🚀 Получить премиум"}
          </button>

          <button
            className="your-button-class"
            onClick={handleTopUp}
            disabled={isBuyLoading}
          >
            {isBuyLoading ? "⏳ Ожидание..." : "Купить 50 000 мавродиков — 10 $"}
          </button>
        </div>
      </div>

      <div className="note-box">
        💡 После оплаты новые функции активируются автоматически. Платёж обрабатывается через Telegram.
      </div>

      <div className="note-box">
        🔐 Мы не запрашиваем доступ к твоим деньгам напрямую. Все операции проходят через Telegram-интерфейс оплаты.
      </div>

      <Link to="/">
        <button className="back-btn">⬅ Вернуться в игру</button>
      </Link>
    </div>
  );
}