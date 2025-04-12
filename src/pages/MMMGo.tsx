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
  const [balance, setBalance] = useState<number | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showMavrodik, setShowMavrodik] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [investors, setInvestors] = useState(0);
  const [nextLevel, setNextLevel] = useState(50000);
  const [highlightRecharge, setHighlightRecharge] = useState(false);
  const [boostActive, setBoostActive] = useState(false);
  const [boostCooldown, setBoostCooldown] = useState(false);
  const [showLevelNotice, setShowLevelNotice] = useState(false);
  const [showBoostEndedNotice, setShowBoostEndedNotice] = useState(false);
  const [isInvestor, setIsInvestor] = useState(false);
  const [srRating, setSrRating] = useState(0);
  const [referrals, setReferrals] = useState(0);

  const levelTitles: string[] = [
    "Новичок", "Подающий надежды", "Местный вкладчик", "Серьёзный игрок",
    "Опытный инвестор", "Финансовый магнат", "Серый кардинал", "Тайный куратор", "Легенда MMMGO"
  ];

  const levelBackgrounds: { [key: number]: string } = {
    1: bg1, 2: bg2, 3: bg3, 4: bg4,
    5: bg5, 6: bg6, 7: bg7, 8: bg8,
  };

  const calculatedLevel = Math.min(Math.floor((balance ?? 0) / 100), 8);
  const backgroundImage =
    calculatedLevel === 0
      ? `url(${moneyBg})`
      : `url(${levelBackgrounds[calculatedLevel]})`;

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setPlayerName(user.first_name);
        setTelegramId(user.id);
        fetch(`https://mmmgo-backend.onrender.com/player/${user.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (typeof data.balance === "number") {
              setBalance(data.balance);
              setLevel(Math.min(Math.floor(data.balance / 100), 8));
              setIsInvestor(data.isInvestor || false);
              setSrRating(data.srRating || 0);
              setReferrals(data.referrals || 0);
              setInitialLoad(false);
            }
          })
          .catch((err) => {
            console.error("Ошибка загрузки игрока:", err);
            setInitialLoad(false);
          });
      }
    }
  }, []);

  useEffect(() => {
    if (balance === null || initialLoad) return;

    const newLevel = Math.min(Math.floor(balance / 100), 8);
    if (level !== null && newLevel !== level) {
      setLevel(newLevel);
      setShowLevelNotice(true);
      setTimeout(() => setShowLevelNotice(false), 3000);
    } else {
      setLevel(newLevel);
    }

    setNextLevel((newLevel + 1) * 100);
    setInvestors(Math.floor(balance / 5000));
  }, [balance]);

  const handleClick = () => {
    if (balance === null || telegramId === null) return;

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

    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId,
        playerName,
        balance: newBalance,
        level: calculatedLevel,
        isBoostActive: boostActive,
        isInvestor,
        srRating,
        referrals,
      }),
    }).catch((err) => console.error("Ошибка сохранения:", err));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (boostActive && balance !== null) {
      interval = setInterval(() => {
        setBalance(prev => {
          const newBalance = (prev ?? 0) + 3;

          if (telegramId) {
            fetch("https://mmmgo-backend.onrender.com/player", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                telegramId,
                playerName,
                balance: newBalance,
                level: calculatedLevel,
                isBoostActive: true,
                isInvestor,
                srRating,
                referrals
              }),
            }).catch((err) => console.error("Ошибка сохранения:", err));
          }

          return newBalance;
        });
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        setBoostActive(false);
        setBoostCooldown(true);
        setShowBoostEndedNotice(true);
        setTimeout(() => setShowBoostEndedNotice(false), 5000);
        setTimeout(() => setBoostCooldown(false), 3600000);
      }, 20000);
    }

    return () => clearInterval(interval);
  }, [boostActive]);

  const handleBoostTaps = () => {
    if (boostActive || boostCooldown) {
      alert("Буст уже активен или на перезарядке!");
      return;
    }

    alert("Просмотр рекламы...");
    setBoostActive(true);
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
            <div className="bar-text">
              🔁 До уровня: {nextLevel - (balance ?? 0)} мавродиков
            </div>
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
          onClick={() => alert("Пополнение скоро!")}
        />

        <Link to="/rank">
          <div className="bar-wrapper">
            <img src={barRank} className="bar-img" alt="Ранг" />
            <div className="bar-text">🏅 Инвестор {level ?? 0}-го ранга</div>
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
            <div className="bar-text">📊 SR рейтинг: #{telegramId || 0}</div>
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
        <h1>Баланс:<br />{initialLoad || balance === null ? "Загрузка мавродиков..." : `${balance} мавродиков`}</h1>

        <button
          className={`coin-button ${boostActive ? "boost-animation" : ""}`}
          onClick={handleClick}
          disabled={balance === null}
        ></button>

        {showMavrodik && (
          <img src={mavrodikFloating} alt="Мавродик" className="floating-mavrodik" />
        )}

        {showBoostEndedNotice && (
          <div className="toast-notice">
            ✨ Буст завершён. Повторно доступен через 1 час.
          </div>
        )}

        <div className="rules-container">
          <Link to="/rules">
            <img src={rulesButton} alt="Правила" className="rules-button-top" />
          </Link>
        </div>
      </div>
    </>
  );
}
