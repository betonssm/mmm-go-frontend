
import React from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css";

export default function PaymentFailed() {
  return (
    <div className="topup-container">
      <div className="note-box">
        <h2>❌ Ошибка оплаты</h2>
        <p>Платёж не был завершён. Попробуй снова или используй другой способ.</p>
      </div>
      <Link to="/topup">
        <button className="back-btn">⬅ Попробовать ещё раз</button>
      </Link>
    </div>
  );
}