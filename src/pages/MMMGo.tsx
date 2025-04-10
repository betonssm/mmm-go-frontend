import React, { useState, useEffect } from "react";
import "./MMMGo.css";
import mavrodikFloating from "../assets/mavrodik_floating.png";
import barLevel from "../assets/bar-level.png";
import barRank from "../assets/bar-rank.png";
import barInvestors from "../assets/bar-investors.png";
import barRating from "../assets/bar-rating.png";
import rechargeGold from "../assets/gold-recharge-button.png";
import { Link } from "react-router-dom";
import rulesButton from "../assets/rules-button.png";  // Импортируем картинку кнопки с прозрачным фоном

export default function MMMGo() {
  const [balance, setBalance] = useState(0);
  const [showMavrodik, setShowMavrodik] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [investors, setInvestors] = useState(0);
  const [nextLevel, setNextLevel] = useState(1000000);
  const [highlightRecharge, setHighlightRecharge] = useState(false);

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
    if (newBalance % 100 === 0) {
      setHighlightRecharge(true);
      setTimeout(() => setHighlightRecharge(false), 2000); // сброс через 2 сек
    }

    // Сохраняем на backend
    if (telegramId) {
      fetch("https://mmm-go-backend.onrender.com/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, balance: newBalance }),
      }).catch((err) => console.error("Ошибка сохранения:", err));
    }
  };
  const handleRecharge = () => {
    alert("Пополнение баланса скоро будет доступно! 💰");
  };

  return (
    <>
      <div className="info-bars">
        <Link to="/level" onClick={() => navigator.vibrate?.(50)}>
          <div className="bar-wrapper">
            <img src={barLevel} className="bar-img" />
            <div className="bar-text">🔁 До уровня: {nextLevel - balance} мавродиков</div>
          </div>
        </Link>

        {/* Кнопка пополнения — НЕ ВНУТРИ bar-wrapper */}
        <img
          src={rechargeGold}
          className={`recharge-gold-button ${highlightRecharge ? "animate-glow" : ""}`}
          alt="Пополнить баланс"
          onClick={handleRecharge}
        />

        <Link to="/rank" onClick={() => navigator.vibrate?.(50)}>
          <div className="bar-wrapper">
            <img src={barRank} className="bar-img" />
            <div className="bar-text">🏅 Инвестор {level}-го ранга</div>
          </div>
        </Link>

        <Link to="/investors" onClick={() => navigator.vibrate?.(50)}>
          <div className="bar-wrapper">
            <img src={barInvestors} className="bar-img" />
            <div className="bar-text">🧍 Вкладчики: {investors}</div>
          </div>
        </Link>

        <Link to="/rating" onClick={() => navigator.vibrate?.(50)}>
          <div className="bar-wrapper">
            <img src={barRating} className="bar-img" />
            <div className="bar-text">📊 SR рейтинг игрока: #{telegramId || 0}</div>
          </div>
        </Link>
      </div>

      <div className="glow-overlay"></div>

      <div className="container">
        <h2>Привет, {playerName || "вкладчик"}!</h2>
        <p className="player-id">ID: {telegramId || "неизвестен"}</p>

        <h1>Баланс:<br />{balance} мавродиков</h1>
        <button className="coin-button" onClick={handleClick}></button>

        {showMavrodik && (
          <img
            src={mavrodikFloating}
            alt="Мавродик"
            className="floating-mavrodik"
          />
        )}

        {/* Кнопка "Правила" */}
        <Link to="/rules">
          <img
            src={rulesButton}
            alt="Правила"
            style={{
              width: "auto",
              height: "50px",  // или другой размер, как тебе нужно
              marginTop: "20px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </Link>
      </div>
    </>
  );
}
