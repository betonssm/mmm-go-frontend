import React, { useState, useEffect } from "react";
import "./MMMGo.css";
import mavrodikFloating from "../assets/mavrodik_floating.png";
import barLevel from "../assets/bar-level.png";
import barRank from "../assets/bar-rank.png";
import barInvestors from "../assets/bar-investors.png";
import barRating from "../assets/bar-rating.png";
import rechargeGold from "../assets/gold-recharge-button.png";
import boostTapImage from "../assets/boost-tap-button.png";
import rulesButton from "../assets/rules-button.png";
import moneyBg from "../assets/money-bg.png";

// Импорт фонов уровней
import bg1 from "../assets/bg-level-1.png";
import bg2 from "../assets/bg-level-2.png";
import bg3 from "../assets/bg-level-3.png";
import bg4 from "../assets/bg-level-4.png";
import bg5 from "../assets/bg-level-5.png";
import bg6 from "../assets/bg-level-6.png";
import bg7 from "../assets/bg-level-7.png";
import bg8 from "../assets/bg-level-8.png";

import { Link } from "react-router-dom";

export default function MMMGo() {
  const [balance, setBalance] = useState(0);
  const [showMavrodik, setShowMavrodik] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [level, setLevel] = useState(0);
  const [investors, setInvestors] = useState(0);
  const [nextLevel, setNextLevel] = useState(50000);
  const [highlightRecharge, setHighlightRecharge] = useState(false);
  const [boostActive, setBoostActive] = useState(false);
  const [boostCooldown, setBoostCooldown] = useState(false);
  const [showLevelNotice, setShowLevelNotice] = useState(false);
  const [showBoostEndedNotice, setShowBoostEndedNotice] = useState(false);

  const levelTitles: string[] = [
    "Новичок",
    "Подающий надежды",
    "Местный вкладчик",
    "Серьёзный игрок",
    "Опытный инвестор",
    "Финансовый магнат",
    "Серый кардинал",
    "Тайный куратор",
    "Легенда MMMGO"
  ];

  const levelBackgrounds: { [key: number]: string } = {
    1: bg1,
    2: bg2,
    3: bg3,
    4: bg4,
    5: bg5,
    6: bg6,
    7: bg7,
    8: bg8,
  };

  const calculatedLevel = Math.min(Math.floor(balance / 100), 8); // тестовая логика
  const backgroundImage = calculatedLevel === 0 ? `url(${moneyBg})` : `url(${levelBackgrounds[calculatedLevel]})`;

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setPlayerName(user.first_name);
        setTelegramId(user.id);
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
    if (calculatedLevel !== level) {
      setLevel(calculatedLevel);
      setShowLevelNotice(true);
      setTimeout(() => setShowLevelNotice(false), 3000);
    }
    setNextLevel((calculatedLevel + 1) * 100);
    setInvestors(Math.floor(balance / 5000));
  }, [balance]);

  
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (boostActive) {
      interval = setInterval(() => {
        setBalance(prev => {
          const newBalance = prev + 3;

          if (newBalance % 100000 === 0) {
            setShowMavrodik(true);
            setTimeout(() => setShowMavrodik(false), 3000);
          }

          if (newBalance % 100 === 0) {
            setHighlightRecharge(true);
            setTimeout(() => setHighlightRecharge(false), 2000);
          }

          if (telegramId) {
            fetch("https://mmm-go-backend.onrender.com/balance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ telegramId, balance: newBalance })
            }).catch(err => console.error("Ошибка сохранения:", err));
          }

          return newBalance;
        });
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        setBoostActive(false);
        setBoostCooldown(true);
        setTimeout(() => setBoostCooldown(false), 3600000);
      }, 20000);
    }

    return () => clearInterval(interval);
  }, [boostActive]);


  const handleClick = () => {
    const coinsToAdd = boostActive ? 3 : 1;
    const newBalance = balance + coinsToAdd;
    setBalance(newBalance);

    if (newBalance % 100000 === 0) {
      setShowMavrodik(true);
      setTimeout(() => setShowMavrodik(false), 3000);
    }

    if (newBalance % 100 === 0) {
      setHighlightRecharge(true);
      setTimeout(() => setHighlightRecharge(false), 2000);
    }

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

  const handleBoostTaps = () => {
    if (boostActive || boostCooldown) {
      alert("Буст уже активен или на перезарядке!");
      return;
    }
  
    alert("Просмотр рекламы...");
  
    setBoostActive(true);
  
    setTimeout(() => {
      setBoostActive(false);
      setBoostCooldown(true);
      setShowBoostEndedNotice(true);
      setTimeout(() => setShowBoostEndedNotice(false), 3000);
      setTimeout(() => setBoostCooldown(false), 3600000);
    }, 20000);
  
  };

  return (
    <>
      {showLevelNotice && (
        <div className="level-up-notice">
          🎉 Новый уровень: {levelTitles[calculatedLevel]}!
        </div>
      )}

      <div className="info-bars">
        <Link to="/level">
          <div className="bar-wrapper">
            <img src={barLevel} className="bar-img" alt="До уровня" />
            <div className="bar-text">🔁 До уровня: {nextLevel - balance} мавродиков</div>
          </div>
        </Link>

        <img
          src={boostTapImage}
          className="boost-tap-button"
          alt="Буст Тапов"
          onClick={handleBoostTaps}
        />

        <img
          src={rechargeGold}
          className={`recharge-gold-button ${highlightRecharge ? "animate-glow" : ""}`}
          alt="Пополнить баланс"
          onClick={handleRecharge}
        />

        <Link to="/rank">
          <div className="bar-wrapper">
            <img src={barRank} className="bar-img" alt="Инвесторский ранг" />
            <div className="bar-text">🏅 Инвестор {level}-го ранга</div>
          </div>
        </Link>

        <Link to="/investors">
          <div className="bar-wrapper">
            <img src={barInvestors} className="bar-img" alt="Вкладчики" />
            <div className="bar-text">🧍 Вкладчики: {investors}</div>
          </div>
        </Link>

        <Link to="/rating">
          <div className="bar-wrapper">
            <img src={barRating} className="bar-img" alt="SR рейтинг" />
            <div className="bar-text">📊 SR рейтинг игрока: #{telegramId || 0}</div>
          </div>
        </Link>
      </div>

      <div className="glow-overlay"></div>

      <div
        className="container"
        style={{
          backgroundImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "background-image 0.8s ease-in-out",
        }}
      >
        <h2>Привет, {playerName || "вкладчик"}!</h2>
        <p className="player-id">ID: {telegramId || "неизвестен"}</p>
        <h1>Баланс:<br />{balance} мавродиков</h1>
        <button
  className={`coin-button ${boostActive ? "boost-animation" : ""}`}
  onClick={handleClick}
></button>

        {showMavrodik && (
          <img
            src={mavrodikFloating}
            alt="Мавродик"
            className="floating-mavrodik"
          />
        )}

        <Link to="/rules">
          <img
            src={rulesButton}
            alt="Правила"
            style={{
              width: "auto",
              height: "50px",
              marginTop: "20px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </Link>
      </div>
      {showBoostEndedNotice && (
  <div className="toast-notice">
    ✨ Буст завершён. Повторно доступен через 1 час.
  </div>
)}
    </>
  );
}