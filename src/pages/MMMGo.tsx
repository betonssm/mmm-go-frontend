import React, { useState, useEffect } from "react";
import "./MMMGo.css";
import mavrodikFloating from "../assets/mavrodik_floating.png";

export default function MMMGo() {
  const [balance, setBalance] = useState(0);
  const [showMavrodik, setShowMavrodik] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [investors, setInvestors] = useState(0);
  const [nextLevel, setNextLevel] = useState(1000000);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (tg) {
      tg.expand();
      const user = tg.initDataUnsafe?.user;

      if (user) {
        setPlayerName(user.first_name);
        setTelegramId(user.id);

        // Загрузка баланса
        fetch(`https://mmm-go-backend.onrender.com/balance/${user.id}`)
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

  useEffect(() => {
    const newLevel = Math.floor(balance / 1000000) + 1;
    setLevel(newLevel);
    setNextLevel(newLevel * 1000000);
    setInvestors(Math.floor(balance / 5000));
  }, [balance]);

  const handleClick = () => {
    const newBalance = balance + 1;
    setBalance(newBalance);

    // Появление Мавродика при 100000
    if (newBalance % 100000 === 0) {
      setShowMavrodik(true);
      setTimeout(() => setShowMavrodik(false), 3000);
    }
    // Автонастройка высоты info-bar
const resizeInfoBar = () => {
  const bar = document.getElementById("info-bar");
  if (bar) {
    const screenWidth = window.innerWidth;
    const height = Math.min(screenWidth * 0.42, 200); // Максимум 160px
    bar.style.height = `${height}px`;
  }
};

resizeInfoBar();
window.addEventListener("resize", resizeInfoBar);

// Очистка события при размонтировании
return () => {
  window.removeEventListener("resize", resizeInfoBar);
};


    // Сохраняем на backend
    if (telegramId) {
      fetch("https://mmm-go-backend.onrender.com/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, balance: newBalance }),
      }).catch((err) => console.error("Ошибка сохранения:", err));
    }
  };

  return (
    <>
      <div className="info-bar" id="info-bar">
  <div className="bar-top">
    🔜 До уровня: {nextLevel - balance} мавродиков
  </div>
  <div className="bar-bottom">
    <div className="rank">🏅 Инвестор {level}-го ранга</div>
    <div className="investors">🧍 Вкладчики: {investors}</div>
  </div>
</div>
  
      <div className="glow-overlay"></div>
  
      <div className="container">
        <h2>Привет, {playerName || "вкладчик"}!</h2>
        <p style={{ fontSize: "14px", color: "#666" }}>
          ID: {telegramId || "неизвестен"}
        </p>
  
        <h1>Баланс: {balance} мавродиков</h1>
        <button className="coin-button" onClick={handleClick}></button>
  
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