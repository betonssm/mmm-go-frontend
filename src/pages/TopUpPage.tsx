
import React from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css"; // добавим позже стили

export default function TopUpPage() {
  return (
    <div className="topup-container">
      <h1>Пополнение баланса</h1>
      <p>Выберите удобный способ оплаты:</p>

      <div className="payment-options">
        <div className="payment-option">
          <h3>💳 Freekassa</h3>
          <p>Оплата картой, ЮMoney, Qiwi и другие способы</p>
          <button disabled>Скоро будет доступно</button>
        </div>

        <div className="payment-option">
          <h3>🪙 Cryptomus</h3>
          <p>Оплата в USDT (TRC20) — комиссия минимальна</p>
          <Link to="/pay/cryptomus">
            <button>Оплатить через Cryptomus</button>
          </Link>
        </div>
      </div>

      <p className="note">
        💡 Для оплаты в USDT убедитесь, что у вас есть немного TRX (0.5–1 TRX) на кошельке для оплаты комиссии.
      </p>

      <Link to="/">
        <button className="back-btn">⬅ Вернуться назад</button>
      </Link>
    </div>
  );
}