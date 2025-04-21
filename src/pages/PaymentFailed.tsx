
import React from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css";

export default function PaymentFailed() {
  return (
    <div className="topup-container">
      <div className="note-box">
  <h2>❌ Ошибка оплаты</h2>
  <p>Платёж не был завершён. Вернись в Telegram и попробуй снова или используй другой способ.</p>
</div>
<button
  className="back-btn"
  onClick={() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.close) {
      tg.close(); // Закрывает WebApp, если запущен внутри Telegram
    } else {
      // Пытаемся открыть Telegram через deep link (работает на мобильных)
      window.location.href = "tg://resolve?domain=mmmgo_bot";

      // Фолбэк — обычная ссылка, если deep link не сработает (ПК, браузер)
      setTimeout(() => {
        window.location.href = "https://t.me/mmmgo_bot";
      }, 1500);
    }
  }}
>
  ⬅ Вернуться в Telegram
</button>
    </div>
  );
}