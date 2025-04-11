import React, { useState, useEffect } from "react";
import "./MMMGo.css";
import mavrodikFloating from "../assets/mavrodik_floating.png";
import barLevel from "../assets/bar-level.png";
import barRank from "../assets/bar-rank.png";
import barInvestors from "../assets/bar-investors.png";
import barRating from "../assets/bar-rating.png";
import rechargeGold from "../assets/gold-recharge-button.png";
import boostTapImage from "../assets/boost-tap-button.png";
import { Link } from "react-router-dom";
import rulesButton from "../assets/rules-button.png";

export default function MMMGo() {
  const [balance, setBalance] = useState(0);
  const [showMavrodik, setShowMavrodik] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [investors, setInvestors] = useState(0);
  const [nextLevel, setNextLevel] = useState(1000000);
  const [highlightRecharge, setHighlightRecharge] = useState(false);
  const [boostActive, setBoostActive] = useState(false);
  const [boostCooldown, setBoostCooldown] = useState(false);

  // Уровневые фоны
  const levelBackgrounds: { [key: number]: string } = {
    1: "/assets/bg-level-1.png",
    2: "/assets/bg-level-2.png",
    3: "/assets/bg-level-3.png",
    4: "/assets/bg-level-4.png",
    5: "/assets/bg-level-5.png",
    6: "/assets/bg-level-6.png",
    7: "/assets/bg-level-7.png",
    8: "/assets/bg-level-8.png",
    9: "/assets/bg-level-9.png",
  };

  const backgroundImage = levelBackgrounds[level] || levelBackgrounds[1];

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
    const calculatedLevel = Math.floor(balance / 100) + 1;
    setLevel(calculatedLevel);
    setNextLevel(calculatedLevel * 100);
    setInvestors(Math.floor(balance / 5000));
  }, [balance]);

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
    setBoostActive(true);
    alert("Буст тапов активирован на 20 секунд!");
    setTimeout(() => {
      setBoostActive(false);
      setBoostCooldown(true);
      alert("Буст завершён. Повторно доступен через 1 час.");
      setTimeout(() => setBoostCooldown(false), 3600000);
    }, 20000);
  };

  return (
    <>
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
            <img src={barRank} className="bar-img" alt="Ранг" />
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
            <img src={barRating} className="bar-img" alt="Рейтинг" />
            <div className="bar-text">📊 SR рейтинг: #{telegramId || 0}</div>
          </div>
        </Link>
      </div>

      <div className="glow-overlay"></div>

      <div
        className="container"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
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
    </>
  );
}