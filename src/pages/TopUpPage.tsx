
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css";

export default function TopUpPage() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/bg-topup.png";
    img.onload = () => setBgLoaded(true);

    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    if (user) setTelegramId(user.id);
  }, []);

  const handlePlisioPayment = async () => {
    if (!telegramId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mmmgo-backend.onrender.com/plisio/create-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegramId, amount: 10 }),
        }
      );
      const data = await response.json();
      if (data && data.data && data.data.invoice_url) {
        window.location.href = data.data.invoice_url;
      } else {
        alert("Ошибка создания платежа. Попробуй позже.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("❌ Ошибка при создании платежа:", err);
      alert("Сервер временно недоступен.");
      setIsLoading(false);
    }
  };

  if (!bgLoaded) return <div className="loading-screen">Загрузка...</div>;

  const handleBuyMavrodiks = async () => {
    if (!telegramId) return;
    setIsLoading(true);
  
    try {
      const response = await fetch("https://mmmgo-backend.onrender.com/plisio/create-balance-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId }),
      });
  
      const data = await response.json();
      if (data?.data?.invoice_url) {
        window.open(data.data.invoice_url, "_blank");
      } else {
        alert("Ошибка создания счёта на оплату.");
      }
    } catch (err) {
      console.error("❌ Ошибка оплаты 50 000 мавродиков:", err);
      alert("Произошла ошибка при создании платежа.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="topup-container" style={{
        backgroundImage: `url(/assets/bg-topup.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "30px 16px 60px",
        boxSizing: "border-box",
      }}>

      {/* Overlay для загрузки */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Загрузка платежа...</p>
        </div>
      )}

      <div className="note-box">
        <h1>🎁 Премиум-доступ</h1>
        <p>Разблокируй расширенные возможности и бонусы!</p>
      </div>

      <div className="payment-options">
        <div className="payment-option">
          <h3>🪙 Оплата через Plisio</h3>
          <p>Поддерживаются USDT, BTC, ETH и другие криптовалюты</p>
          <button onClick={handlePlisioPayment} disabled={isLoading}>
            {isLoading ? "⏳ Ожидание..." : "🚀 Получить премиум"}
          </button>
          <button className="your-button-class" onClick={handleBuyMavrodiks} disabled={isLoading}>
  Купить 50 000 мавродиков — 10 $
</button>
        </div>
      </div>

      <div className="note-box">
        💡 Убедись, что на кошельке есть средства на оплату и комиссию сети.
      </div>
      <div className="note-box">
        💡 Платёж является добровольным. В MMMGO нет обещаний дохода или возврата средств.
      </div>

      <Link to="/">
        <button className="back-btn">⬅ Вернуться в игру</button>
      </Link>
    </div>
  );
}
