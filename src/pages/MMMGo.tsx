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
  const [balance, setBalance] = useState(null);
  const [level, setLevel] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showMavrodik, setShowMavrodik] = useState(false);
  const [playerName, setPlayerName] = useState(null);
  const [telegramId, setTelegramId] = useState(null);
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
  const [totalTaps, setTotalTaps] = useState(0);
  const [adsWatched, setAdsWatched] = useState(0);
  const [refSource, setRefSource] = useState(null);
  const [showNoRefNotice, setShowNoRefNotice] = useState(false);
  const [showAdNotice, setShowAdNotice] = useState(false);
  const [boostCooldownUntil, setBoostCooldownUntil] = useState<Date | null>(null);

  const levelTitles = [
    "Новичок", "Подающий надежды", "Местный вкладчик", "Серьёзный игрок",
    "Опытный инвестор", "Финансовый магнат", "Серый кардинал", "Тайный куратор", "Легенда MMMGO"
  ];

  const levelBackgrounds = { 1: bg1, 2: bg2, 3: bg3, 4: bg4, 5: bg5, 6: bg6, 7: bg7, 8: bg8 };

  const calculatedLevel = Math.min(Math.floor((balance ?? 0) / 100), 8);
  const backgroundImage = initialLoad ? "none" : calculatedLevel === 0 ? `url(${moneyBg})` : `url(${levelBackgrounds[calculatedLevel]})`;

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.ready?.();
    tg.expand?.();

    const ref = new URLSearchParams(window.location.search).get("ref");
    setRefSource(ref ?? null);

    const loadUser = () => {
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setPlayerName(user.first_name);
        setTelegramId(user.id);

        fetch(`https://mmmgo-backend.onrender.com/player/${user.id}?ref=${ref ?? ""}`)
          .then(res => res.json())
          .then(data => {
            if (data.boostCooldownUntil) {
              const cooldownEnd = new Date(data.boostCooldownUntil);
              setBoostCooldownUntil(cooldownEnd);
            
              if (cooldownEnd > new Date()) {
                setBoostCooldown(true);
              }
            }
            if (typeof data.balance === "number") {
              setBalance(data.balance);
              setLevel(Math.min(Math.floor(data.balance / 100), 8));
              setIsInvestor(data.isInvestor || false);
              setSrRating(data.srRating || 0);
              setReferrals(data.referrals || 0);

              if (ref && data.refSource === null && data.referrals === 0) {
                setShowNoRefNotice(true);
              }
            }
            setInitialLoad(false);
          })
          .catch(err => {
            console.error("Ошибка загрузки игрока:", err);
            setInitialLoad(false);
          });
      } else {
        setTimeout(loadUser, 300);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (balance === null || initialLoad) return;
    const newLevel = Math.min(Math.floor(balance / 100), 8);
    setLevel(newLevel);
    setNextLevel((newLevel + 1) * 100);
    setInvestors(Math.floor(balance / 5000));
  }, [balance]);

  const handleClick = () => {
    if (balance === null || telegramId === null) return;
    const coinsToAdd = boostActive ? 3 : 1;
    const newBalance = balance + coinsToAdd;
    setBalance(newBalance);
    setTotalTaps(prev => prev + 1);

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
      body: JSON.stringify({ telegramId, playerName, balance: newBalance, level: calculatedLevel, isBoostActive: boostActive, isInvestor, referrals, totalTaps, adsWatched })
    }).catch(err => console.error("Ошибка сохранения:", err));
  };

  const handleBoostTaps = () => {
    if (boostActive || boostCooldown) {
      alert("Буст уже активен или на перезарядке!");
      return;
    }
  
    setShowAdNotice(true);
  
    setTimeout(() => {
      setShowAdNotice(false);
      setBoostActive(true);
  
      const cooldownEndTime = new Date(Date.now() + 3600 * 1000);
      setBoostCooldownUntil(cooldownEndTime);
  
      if (telegramId) {
        fetch("https://mmmgo-backend.onrender.com/player", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegramId,
            playerName,
            balance,
            level: calculatedLevel,
            isBoostActive: true,
            isInvestor,
            referrals,
            totalTaps,
            adsWatched,
            boostCooldownUntil: cooldownEndTime.toISOString(),
          }),
        });
      }
  
      setAdsWatched((prev) => prev + 1); // ⬅️ ВНЕ if
    }, 1500);
  };

  useEffect(() => {
    if (!boostActive || balance === null) return;
    const interval = setInterval(() => {
      setBalance(prev => {
        const newBalance = (prev ?? 0) + 3;
        if (telegramId) {
          fetch("https://mmmgo-backend.onrender.com/player", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telegramId, playerName, balance: newBalance, level: calculatedLevel, isBoostActive: true, isInvestor, referrals, totalTaps, adsWatched })
          }).catch(err => console.error("Ошибка сохранения:", err));
        }
        return newBalance;
      });
    }, 500);

    const stopBoost = setTimeout(() => {
      clearInterval(interval);
      setBoostActive(false);
      setBoostCooldown(true);
      setShowBoostEndedNotice(true);
      setTimeout(() => setShowBoostEndedNotice(false), 5000);
      setTimeout(() => setBoostCooldown(false), 3600000);
    }, 20000);

    return () => {
      clearInterval(interval);
      clearTimeout(stopBoost);
    };
  }, [boostActive]);

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
        <img src={boostTapImage} className="boost-tap-button" alt="Буст Тапов" onClick={handleBoostTaps} />
        <img src={rechargeGold} className={`recharge-gold-button ${highlightRecharge ? "animate-glow" : ""}`} alt="Пополнить баланс" onClick={() => alert("Пополнение скоро!")} />
        <Link to="/rank">
          <div className="bar-wrapper">
            <img src={barRank} className="bar-img" alt="Ранг" />
            <div className="bar-text">🏅 Инвестор {level ?? 0}-го ранга</div>
          </div>
        </Link>
        <Link to="/referrals">
          <div className="bar-wrapper">
            <img src={barInvestors} className="bar-img" alt="Рефералы" />
            <div className="bar-text">👥 Рефералы: {referrals}</div>
          </div>
        </Link>
        <Link to="/rating">
          <div className="bar-wrapper">
            <img src={barRating} className="bar-img" alt="SR рейтинг" />
            <div className="bar-text">📊 SR рейтинг: {srRating}</div>
          </div>
        </Link>
      </div>
      <div className="glow-overlay"></div>
      <div className="container" style={{ backgroundImage, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", transition: "background-image 0.8s ease-in-out" }}>
        <h2>Привет, {playerName || "вкладчик"}!</h2>
        <p className="player-id">ID: {telegramId || "неизвестен"}</p>
        {showNoRefNotice && (
          <div style={{ background: "rgba(255,0,0,0.2)", color: "#fff", padding: "10px 20px", borderRadius: "10px", margin: "10px auto", maxWidth: "90%", fontWeight: "bold", boxShadow: "0 0 10px red" }}>
            ⚠️ Реферал не засчитан.<br />Убедитесь, что вы открыли ссылку от друга <u>впервые</u> или <u>удалите бота и начните заново</u> по ссылке.
          </div>
        )}
        <h1>Баланс:<br />{initialLoad || balance === null ? "Загрузка мавродиков..." : `${balance} мавродиков`}</h1>
        <button className={`coin-button ${boostActive ? "boost-animation" : ""}`} onClick={handleClick} disabled={balance === null}></button>
        {showMavrodik && (<img src={mavrodikFloating} alt="Мавродик" className="floating-mavrodik" />)}
        {showBoostEndedNotice && (<div className="toast-notice">✨ Буст завершён. Повторно доступен через 1 час.</div>)}
        {showAdNotice && (<div className="toast-notice">🎥 Реклама просмотрена! Буст активирован на 20 секунд.</div>)}
        <div className="rules-container">
          <Link to="/rules">
            <img src={rulesButton} alt="Правила" className="rules-button-top" />
          </Link>
        </div>
      </div>
    </>
  );
}
