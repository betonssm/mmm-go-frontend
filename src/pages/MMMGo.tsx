import React, { useState, useEffect } from "react";
import "./MMMGo.css";
import mavrodikFloating from "../assets/mavrodik_floating.png";

export default function MMMGo() {
  const [balance, setBalance] = useState(0);
  const [showMavrodik, setShowMavrodik] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (tg) {
      tg.expand(); // раскрыть WebApp на весь экран
      const user = tg.initDataUnsafe?.user;

      if (user) {
        console.log("Пользователь:", user);
        alert(`Привет, ${user.first_name || "вкладчик"}! 👋`);
        // Можем сохранить user.id или user.username
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