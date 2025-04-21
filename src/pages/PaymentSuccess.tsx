
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css"; // можно использовать те же стили

export default function PaymentSuccess() {
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    if (user) {
      fetch(`https://mmmgo-backend.onrender.com/player/${user.id}`)
        .then(res => res.json())
        .then(player => {
          const now = new Date();
          const start = player.srActiveSince ? new Date(player.srActiveSince) : null;
          if (start && now < start) {
            alert(
              `Ваш SR‑рейтинг начнёт начисляться с ${start.toLocaleDateString()}. ` +
              `Вы будете участвовать в распределении фонда следующего месяца.`
            );
          }
        })
        .catch(err => console.error("Ошибка загрузки данных игрока:", err));
    }
  }, []);
  return (
    <div className="topup-container">
  <div className="note-box">
  <h2>✅ Оплата прошла успешно</h2>
  <p>Премиум-доступ активирован,мавродики на балансе. Вернись в Telegram, чтобы продолжить игру!</p>
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