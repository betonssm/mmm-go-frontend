
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
        <p>Премиум-доступ будет активирован в течение 1–2 минут.</p>
      </div>
      <Link to="/">
        <button className="back-btn">⬅ Вернуться в игру</button>
      </Link>
    </div>
  );
}