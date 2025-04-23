
import React from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css";

export default function PaymentFailed() {
  return (
    <div className="topup-container">
      <div className="note-box">
  <h2>❌ Ошибка оплаты</h2>
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