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
import { useEffect } from "react";

export default function MMMGo() {
  const [balance, setBalance] = useState(null);
  const [level, setLevel] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showMavrodik, setShowMavrodik] = useState(false);
  const [playerName, setPlayerName] = useState(null);
  const [telegramId, setTelegramId] = useState(null);
  const [investors, setInvestors] = useState(0);
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
  const [boostCooldownUntil, setBoostCooldownUntil] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showBoostCooldownNotice, setShowBoostCooldownNotice] = useState(false);
  const levelTitles = [
    "Новичок", "Подающий надежды", "Местный вкладчик", "Серьёзный игрок",
    "Опытный инвестор", "Финансовый магнат", "Серый кардинал", "Тайный куратор", "Легенда MMMGO"
  ];
  const [dailyClicks, setDailyClicks] = useState(0);
  const [weeklyMavro, setWeeklyMavro] = useState(0);
  const [premiumExpires, setPremiumExpires] = useState<string | null>(null);
  const levelBackgrounds = { 1: bg1, 2: bg2, 3: bg3, 4: bg4, 5: bg5, 6: bg6, 7: bg7, 8: bg8 };
  const getLevelByBalance = (balance: number): number => {
    if (balance >= 5_000_000) return 8;
    if (balance >= 2_500_000) return 7;
    if (balance >= 1_000_000) return 6;
    if (balance >= 600_000) return 5;
    if (balance >= 300_000) return 4;
    if (balance >= 100_000) return 3;
    if (balance >= 50_000) return 2;
    if (balance >= 10_000) return 1;
    return 0;
  };
  const calculatedLevel = getLevelByBalance(balance ?? 0);
  const levelThresholds = [
    0,        // Уровень 1
    10_000,   // Уровень 2
    50_000,   // Уровень 3
    100_000,  // Уровень 4
    300_000,  // Уровень 5
    600_000,  // Уровень 6
    1_000_000,// Уровень 7
    2_500_000,// Уровень 8
    5_000_000 // Уровень 9 (максимум)
  ];
  const nextLevelThreshold = calculatedLevel + 1 < levelThresholds.length
  ? levelThresholds[calculatedLevel + 1]
  : null;
const progressToNextLevel = nextLevelThreshold !== null
  ? nextLevelThreshold - (balance ?? 0)
  : 0;
  const backgroundImage = initialLoad
  ? "none"
  : calculatedLevel === 0
  ? `url(${moneyBg})`
  : `url(${levelBackgrounds[calculatedLevel]})`;
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage.replace(/^url\(|\)$/g, "").replace(/"/g, "");
    img.onload = () => setBgLoaded(true);
  }, [backgroundImage]);
  
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
              const now = new Date();
              if (cooldownEnd > now) {
                setBoostCooldown(true);
                setTimeout(() => setBoostCooldown(false), cooldownEnd.getTime() - now.getTime());
              } else {
                setBoostCooldown(false);
              }
            }

            if (typeof data.balance === "number") {
              setBalance(data.balance);
              setLevel(getLevelByBalance(data.balance || 0));
              setIsInvestor(data.isInvestor || false);
              setSrRating(data.srRating || 0);
              setPremiumExpires(data.premiumExpires || null);
              setReferrals(data.referrals || 0);
              setAdsWatched(data.adsWatched || 0);
              setTotalTaps(data.totalTaps || 0);
              setWeeklyMavro(data.weeklyMission?.current || 0);
              setDailyClicks(data.dailyTasks?.dailyTaps || 0);

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
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  useEffect(() => {
    if (!telegramId || balance === null || initialLoad) return;

    const srRatingCalculated = Math.floor(
      Math.log2((referrals || 0) + 1) * 40 +
      Math.log2((totalTaps || 0) + 1) * 25 +
      Math.log2((adsWatched || 0) + 1) * 35
    );

    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId,
        playerName,
        balance,
        level: calculatedLevel,
        isBoostActive: boostActive,
        isInvestor,
        referrals,
        totalTaps,
        adsWatched,
        srRating: srRatingCalculated,
        boostCooldownUntil: boostCooldownUntil?.toISOString() ?? null
      }),
    }).catch((err) => console.error("❌ Ошибка автосохранения:", err));

  }, [balance, totalTaps, adsWatched, referrals, isInvestor, calculatedLevel]);
  
  const handleClick = () => {
    if (balance === null || telegramId === null) return;
  
    const coinsToAdd = boostActive ? 3 : 1;
    const newBalance = balance + coinsToAdd;
    const newTaps = totalTaps + 1;
    const newDaily = dailyClicks + 1;
    const newWeekly = weeklyMavro + coinsToAdd;
  
    setBalance(newBalance);
    setTotalTaps(newTaps);
    setDailyClicks(newDaily);
    setWeeklyMavro(newWeekly); // 👈 не забудь!
  
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
        balanceBonus: coinsToAdd,
        level: calculatedLevel,
        isBoostActive: boostActive,
        isInvestor,
        referrals,
        totalTaps: newTaps,
        adsWatched,
        boostCooldownUntil: boostCooldownUntil?.toISOString() ?? null,
        dailyTasks: {
          dailyTaps: newDaily,
          dailyTarget: 5000,
        },
        weeklyMission: {
          mavrodikGoal: 100000,
          current: newWeekly,
          completed: newWeekly >= 100000,
        },
      }),
    }).catch((err) => console.error("❌ Ошибка сохранения баланса:", err));
  };
  

  const handleBoostTaps = () => {
    if (boostActive || boostCooldown) {
      // Показываем уведомление
      setShowBoostCooldownNotice(true);
      setTimeout(() => setShowBoostCooldownNotice(false), 4000);
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
  
      setAdsWatched((prev) => prev + 1);
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
            body: JSON.stringify({
              telegramId,
              playerName,
              balanceBonus: 3,             // вместо полного баланса — отправляем бонус
              level: calculatedLevel,
              isBoostActive: true,
              isInvestor,
              referrals,
              totalTaps,
              adsWatched,
              boostCooldownUntil: boostCooldownUntil?.toISOString() ?? null
            }),
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
  
      {/* Сплэш-экран пока фон не загружен */}
      {!bgLoaded && (
        <div className="splash-loader">
          <p>Загрузка...</p>
        </div>
      )}
  
      <div className="glow-overlay"></div>
  
      <div
        className="container"
        style={{
          backgroundImage: bgLoaded ? backgroundImage : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "background-image 0.8s ease-in-out",
        }}
      >
        <h2>Привет, {playerName || "вкладчик"}!</h2>
        <p className="player-id">ID: {telegramId || "неизвестен"}</p>
  
        {showNoRefNotice && (
          <div className="ref-warning">
            ⚠️ Реферал не засчитан.<br />
            Убедитесь, что вы открыли ссылку от друга <u>впервые</u> или{" "}
            <u>удалите бота и начните заново</u> по ссылке.
          </div>
        )}
  
        <h1>
          Баланс:
          <br />
          {initialLoad || balance === null
            ? "Загрузка мавродиков..."
            : `${balance} мавродиков`}
        </h1>
  
        <button
          className={`coin-button ${boostActive ? "boost-animation" : ""}`}
          onClick={handleClick}
          disabled={balance === null}
        ></button>
  
        {/* КНОПКИ НАД БАРАМИ */}
        <div className="bottom-buttons">
          <img
            src={boostTapImage}
            className="boost-tap-button"
            alt="Буст Тапов"
            onClick={handleBoostTaps}
          />
          <Link to="/topup">
            <img
              src={rechargeGold}
              className={`recharge-gold-button ${highlightRecharge ? "animate-glow" : ""}`}
              alt="Пополнить баланс"
            />
          </Link>
        </div>
  
        {/* БАРЫ 2x2 */}
        <div className="info-bars">
          <Link to="/level">
          <div className="bar-wrapper">
  <img src={barLevel} className="bar-img" alt="До уровня" />
  <div className="bar-text">
    {nextLevelThreshold === null
      ? "🔝 Максимальный уровень"
      : `📶⬆ До следующего уровня: ${progressToNextLevel.toLocaleString()}`}
  </div>
</div>
          </Link>
  
          <Link to="/rank">
  <div className="bar-wrapper">
    <img src={barRank} className="bar-img" alt="Задания" />
    <div className="bar-text">📋 Задания: проверь цели</div>
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
              <div className="bar-text">📊 SR рейтинг: {(() => {
    const now = new Date();
    const exp = premiumExpires ? new Date(premiumExpires) : null;
    return (isInvestor && exp && now < exp)
      ? srRating
      : "—";
  })()}</div>
            </div>
          </Link>
        </div>
  
        {showMavrodik && (
          <img src={mavrodikFloating} alt="Мавродик" className="floating-mavrodik" />
        )}
        {showBoostEndedNotice && (
          <div className="toast-notice">
            ✨ Буст завершён. Повторно доступен через 1 час.
          </div>
        )}
        {showAdNotice && (
          <div className="toast-notice">
            🎥 Реклама просмотрена! Буст активирован на 20 секунд.
          </div>
        )}
        {showBoostCooldownNotice && (
  <div className="toast-notice red">
    ⏳ Буст уже активен или на перезарядке. Попробуй позже!
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
