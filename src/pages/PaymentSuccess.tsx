
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css";

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

    // ⛔ добавь auto-close как fallback
    if (tg?.close) {
      tg.close();
    } else {
      setTimeout(() => {
        window.location.href = "https://t.me/mmmgo_bot";
      }, 2000);
    }
  }, []);

  return (
    <div className="topup-container">
      <div className="note-box">
        <h2>✅ Оплата прошла успешно</h2>

        <p className="text-center mt-4">
          Если Telegram не открылся автоматически,&nbsp;
          <a href="https://t.me/mmmgo_bot" target="_blank" rel="noopener noreferrer">
            нажмите сюда, чтобы вернуться в бота
          </a>.
        </p>

        <div className="mt-4 text-center">
          <a
            href="https://t.me/mmmgo_bot"
            className="back-btn inline-block px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            🔄 Вернуться в Telegram
          </a>
        </div>
      </div>
    </div>
  );
}