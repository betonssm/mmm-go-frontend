
import React from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css"; // можно использовать те же стили

export default function PaymentSuccess() {
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