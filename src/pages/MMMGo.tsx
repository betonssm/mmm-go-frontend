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
import translations from "../locales.js";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef, useMemo } from "react";
Date.prototype.getWeek = function () {
  const oneJan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this as any) - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
};

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
  const [showNotice, setShowNotice] = useState<string | null>(null);
  const [coins, setCoins] = useState([]);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);
  const [showPrizeMessage, setShowPrizeMessage] = useState<string | null>(null);
  const [prizeClaimed, setPrizeClaimed] = useState(false);
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
  
    let ref = new URLSearchParams(window.location.search).get("ref");

if (!ref && window.Telegram?.WebApp?.initDataUnsafe?.start_param) {
  const param = window.Telegram.WebApp.initDataUnsafe.start_param;
  if (param.startsWith("ref_")) {
    ref = param.replace("ref_", "");
  }
}
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
              if (
                data.weeklyMission?.completed &&
                data.lastWeeklyRewardAt &&
                data.weeklyMission.current >= data.weeklyMission.mavrodikGoal
              ) {
                const rewardDate = new Date(data.lastWeeklyRewardAt);
                const now = new Date();
                const rewardWeek = rewardDate.getFullYear() + "-" + rewardDate.getWeek();
                const nowWeek = now.getFullYear() + "-" + now.getWeek();
              
                if (rewardWeek !== nowWeek) {
                  setShowNotice("🎁 Ты получил 10 000 мавродиков за выполнение недельной цели!");
                  setTimeout(() => setShowNotice(null), 6000);
                }
              }
              setDailyClicks(data.dailyTasks?.dailyTaps || 0);
  
              if (ref && !data.refSourceSaved && data.referrals === 0) {
                setShowNoRefNotice(true);
              }
            }
  
            if (data.srActiveSince) {
              const srStart = new Date(data.srActiveSince);
              const now = new Date();
              if (srStart > now) {
                const locale = navigator.language.startsWith("en") ? "en" : "ru";
                const formattedDate = srStart.toLocaleDateString(locale === "en" ? "en-US" : "ru-RU");
                const msg = translations[locale].srNotice(formattedDate);
                setShowNotice(msg);
                setTimeout(() => setShowNotice(null), 6000);
              }
            }
  
            setInitialLoad(false);
          })
          .catch(err => {
            console.error("❌ Ошибка загрузки игрока:", err);
            setInitialLoad(false);
          });
      } else {
        setTimeout(loadUser, 300);
      }
    };
  
    loadUser(); // вызываем ЗДЕСЬ — после объявления функции
  }, []);
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  useEffect(() => {
    if (!telegramId || balance === null || initialLoad) return;


    fetch("https://mmmgo-backend.onrender.com/player", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId,
        playerName,
        level: calculatedLevel,
        isBoostActive: boostActive,
        isInvestor,
        referrals,
        totalTaps,
        adsWatched,
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
    const previousLevel = getLevelByBalance(balance);
const newLevel = getLevelByBalance(newBalance);

if (newLevel > previousLevel) {
  setShowLevelNotice(true);
  setTimeout(() => setShowLevelNotice(false), 5000);
}
  
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
        refSource,
        totalTaps: newTaps,
        adsWatched,
        boostCooldownUntil: boostCooldownUntil?.toISOString() ?? null,
        dailyTasks: {
          dailyTaps: newDaily,
          dailyTarget: 5000,
        },
        
      }),
      keepalive: true
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
            adsWatched,                  // текущее adsWatched
            boostCooldownUntil: cooldownEndTime.toISOString(),
          }),
        }).catch(err => console.error("Ошибка сохранения буста:", err));
      }
  

    }, 1500);
  };
  
      
  // 1️⃣ Интервал «+3 мавродика» и fetch — запускается/чистится только при изменении boostActive
  useEffect(() => {
    if (!boostActive || telegramId === null) return;
  
    let interval: ReturnType<typeof setInterval>;
    let stopBoost: ReturnType<typeof setTimeout>;
  
    let localDaily = dailyClicks;
    let localWeekly = weeklyMavro;
  
    interval = setInterval(() => {
      const coinsToAdd = 3;
  
      setBalance(prev => (prev ?? 0) + coinsToAdd);
      localDaily += coinsToAdd;
      localWeekly += coinsToAdd;
  
      setDailyClicks(localDaily);
      setWeeklyMavro(localWeekly);
  
      fetch("https://mmmgo-backend.onrender.com/player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramId,
          playerName,
          balanceBonus: coinsToAdd,
          level: calculatedLevel,
          isBoostActive: true,
          isInvestor,
          referrals,
          refSource, 
          totalTaps,
          adsWatched,
          boostCooldownUntil: boostCooldownUntil?.toISOString() ?? null,
          dailyTasks: {
            dailyTaps: localDaily,
            dailyTarget: 5000
          },
          weeklyMission: {
            mavrodikGoal: 100000,
            current: localWeekly,
            completed: localWeekly >= 100000
          }
        }),
        keepalive: true
      }).catch(err => console.error("Ошибка сохранения буста:", err));
    }, 500);
  
    stopBoost = setTimeout(() => {
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
  }, [boostActive, telegramId]);
  useEffect(() => {
    let interval: any;
    if (boostActive) {
      interval = setInterval(() => {
        const newCoins = Array.from({ length: 10 }).map(() => ({
          id: Math.random(),
          left: Math.random() * 100,
          size: 15 + Math.random() * 15,
          duration: 1.5 + Math.random(),
          delay: Math.random(),
        }));
        setCoins(prev => [...prev, ...newCoins]);
      }, 500);
    }
  
    return () => clearInterval(interval);
  }, [boostActive]);
  const prizeOptions = [
    { amount: 1000, className: "card-back-1000" },
    { amount: 1000, className: "card-back-1000" },
    { amount: 1000, className: "card-back-1000" },
    { amount: 5000, className: "card-back-5000" },
    { amount: 10000, className: "card-back-10000" },
    { amount: 20000, className: "card-back-20000" },
  ];
  

const shuffledPrizes = useMemo(() => {
  return prizeOptions.sort(() => Math.random() - 0.5).slice(0, 6);
}, [showPrizeModal]);
    useEffect(() => {
      if (!showPrizeModal) {
        setRevealedIndex(null);
        setPrizeClaimed(false); // ← добавь эту строку
      }
    }, [showPrizeModal]);

   const balanceRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!balanceRef.current || initialLoad || balance === null) return;
      const el = balanceRef.current;
      el.classList.add("balance-bounce");
      const timeout = setTimeout(() => el.classList.remove("balance-bounce"), 300);
      return () => clearTimeout(timeout);
    }, [balance]);

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
      {showPrizeModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>🎁 Ежедневный розыгрыш</h2>
      <div className="card-grid">
        {shuffledPrizes.map((prize, i) => (
          <div
            key={i}
            className={`card ${revealedIndex === i ? "revealed" : ""}`}
            onClick={() => {
              if (revealedIndex !== null || prizeClaimed) return;
              setRevealedIndex(i);
              setPrizeClaimed(true);

              fetch("https://mmmgo-backend.onrender.com/player/player/claim-prize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ telegramId, prizeAmount: prize.amount }),
              })
                .then(res => res.json())
                .then(data => {
                  if (data.newBalance) {
                    setBalance(data.newBalance);
                    setShowPrizeMessage(`+${prize.amount.toLocaleString()} мавродиков! 🎉`);
setTimeout(() => setShowPrizeMessage(null), 3000);
                    // setDailyClicks(prev => prev + prize.amount); // ⛔️ Не учитываем в дневной миссии
                    setWeeklyMavro(prev => prev + prize.amount);
                  } else if (data.error) {
                    setShowPrizeMessage(`❌ ${data.error}`);
setTimeout(() => setShowPrizeMessage(null), 3000);
                  }
                })
                .catch(err => console.error("Ошибка получения приза:", err));
            }}
          
    >
      <div className="card-inner">
        <div className="card-front" />
        <div className={`card-back ${prize.className} ${revealedIndex === i ? "flash" : ""}`}>
        <span>{(prize.amount / 1000).toString().replace(/\.0$/, "")}К</span>
</div>
        </div>
  </div>
))}
{showPrizeMessage && (
  <div className="prize-popup">{showPrizeMessage}</div>
)}
      </div>
      <button onClick={() => setShowPrizeModal(false)}>Закрыть</button>
    </div>
  </div>
)}
  
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
  <div className="greeting-card">
  <div className="greeting-level">
    {levelTitles[calculatedLevel] || "Без уровня"}
  </div>
  <div className="greeting-name">
  {playerName || "Без имени"}{" "}
  {isInvestor && premiumExpires && new Date(premiumExpires) > new Date() && (
    <span className="premium-star">⭐️</span>
  )}
</div>
</div>
  {/* 
        {showNoRefNotice && (
          <div className="ref-warning">
            ⚠️ Реферал не засчитан.<br />
            Убедитесь, что вы открыли ссылку от друга <u>впервые</u> или{" "}
            <u>удалите бота и начните заново</u> по ссылке.
          </div>
        )}
 */} 
        <div className="balance-display" ref={balanceRef}>
  {initialLoad || balance === null
    ? "Загрузка..."
    : balance.toLocaleString()}
</div>
  
        <button
          className={`coin-button ${boostActive ? "boost-animation" : ""}`}
          onClick={handleClick}
          disabled={balance === null}
        ></button>
        {boostActive && (
  <div className="coin-rain">
    {coins.map((coin) => (
      <div
        key={coin.id}
        className="coin-drop"
        style={{
          left: `${coin.left}%`,
          animationDuration: `${coin.duration}s`,
          animationDelay: `${coin.delay}s`,
          width: `${coin.size}px`,
          height: `${coin.size}px`,
        }}
      />
    ))}
  </div>
)}

  
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
              <div className="bar-text">👥 Друзья: {referrals}</div>
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
             🚀 Буст активирован на 20 секунд.
          </div>
        )}
        {showBoostCooldownNotice && (
  <div className="toast-notice red">
    ⏳ Буст уже активен или на перезарядке. Попробуй позже!
  </div>
)}
  <button className="gift-button" onClick={() => setShowPrizeModal(true)}>
  <img src="/assets/gift-icon.png" alt="Подарок" />
</button>
        <div className="rules-container">
          <Link to="/rules">
            <img src={rulesButton} alt="Правила" className="rules-button-top" />
          </Link>
        </div>
      </div>
    </>
  );
}
