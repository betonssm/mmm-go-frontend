import React, { useState, useEffect } from "react";
import "./MMMGo.css";
import mavrodikFloating from "../assets/mavrodik_floating.png";

export default function MMMGo() {
  const [balance, setBalance] = useState(0);
  const [showMavrodik, setShowMavrodik] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<number | null>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (tg) {
      tg.expand();
      const user = tg.initDataUnsafe?.user;

      if (user) {
        setPlayerName(user.first_name);
        setTelegramId(user.id);

        // Загрузка баланса
        fetch(`http://localhost:3001/balance/${user.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (typeof data.balance === "number") {
              setBalance(data.balance);
            }
          })
          .catch((err) => console.error("Ошибка загрузки баланса:", err));
      }
    }
  }, []);

  const handleClick = () => {
    const newBalance = balance + 100;
    setBalance(newBalance);

    // Показ Мавродика
    if (newBalance % 1000 === 0) {
      setShowMavrodik(true);
      setTimeout(() => setShowMavrodik(false), 3000);
    }

    // Вибрация
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Сохраняем баланс
    if (telegramId) {
      fetch("http://localhost:3001/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, balance: newBalance }),
      }).catch((err) => console.error("Ошибка сохранения:", err));
    }
  };

  return (
    <>
      <div className="glow-overlay"></div>

      <div className="container">
        <h2>Привет, {playerName || "вкладчик"}!</h2>
        <p style={{ fontSize: "14px", color: "#666" }}>
          ID: {telegramId || "неизвестен"}
        </p>

        <h1>Баланс: {balance} мавродиков</h1>
        <button onClick={handleClick}>👆 Привлечь вкладчика</button>

        {showMavrodik && (
          <img
            src={mavrodikFloating}
            alt="Мавродик"
            className="floating-mavrodik"
          />
        )}
      </div>
    </>
  );
}