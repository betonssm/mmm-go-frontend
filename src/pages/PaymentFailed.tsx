
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
    if (tg) {
      tg.close(); // Закрывает WebApp и возвращает в Telegram
    } else {
      window.location.href = "https://t.me/mmmgo_bot"; // Фолбэк для обычного браузера
    }
  }}
>
  ⬅ Вернуться в Telegram
</button>
    </div>
  );
}