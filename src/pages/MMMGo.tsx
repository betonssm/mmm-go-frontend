import React, { useState, useEffect } from "react";
import "./MMMGo.css";
import mavrodikFloating from "../assets/mavrodik_floating.png";

export default function MMMGo() {
  const [balance, setBalance] = useState(0);
  const [showMavrodik, setShowMavrodik] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (tg) {
      tg.expand(); // Раскрыть WebApp

      const user = tg.initDataUnsafe?.user;

      if (user) {
        setPlayerName(user.first_name);
        setPlayerId(user.id);
        console.log("🧑 Игрок:", user);
      }
    }
  }, []);

  const handleClick = () => {
    const newBalance = balance + 100;
    setBalance(newBalance);

    if (newBalance % 1000 === 0) {
      setShowMavrodik(true);
      setTimeout(() => setShowMavrodik(false), 3000);
    }

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <>
      <div className="glow-overlay"></div>

      <div className="container">
        <h2>Привет, {playerName || "вкладчик"}!</h2>
        <p style={{ fontSize: "14px", color: "#666" }}>
          ID: {playerId || "неизвестен"}
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