
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css";

export default function PlayerRatingPage() {
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fund, setFund] = useState<number | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
const [walletAddress, setWalletAddress] = useState("");
const [walletSaved, setWalletSaved] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    if (user) {
      fetch(`https://mmmgo-backend.onrender.com/player/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPlayerData(data);
          if (data.walletAddressTRC20 && data.walletAddressTRC20.length === 34) {
            setWalletSaved(true);
          }
        })
        .catch((err) => console.error("Ошибка загрузки данных игрока:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    fetch(`https://mmmgo-backend.onrender.com/fund`)
    .then(res => res.json())
    .then(data => setFund(data.total))
    .catch(err => console.error("Ошибка загрузки пула:", err));
    

    const img = new Image();
    img.src = "/assets/bg-rating.png";
    img.onload = () => setBgLoaded(true);
  }, []);

  if (!bgLoaded || loading) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  if (!playerData) {
    return <div className="error">Не удалось загрузить данные игрока.</div>;
  }

  const { srRating, isInvestor, premiumExpires } = playerData;
  const now = new Date();
  const expires = premiumExpires ? new Date(premiumExpires) : null;
  const isActive = isInvestor && expires && now < expires;
  

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(/assets/bg-rating.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "30px",
        paddingBottom: "30px",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
 position: "relative",
  marginBottom: "24px",
  background: "linear-gradient(135deg, #fff8dc, #ffe082)",
  color: "#000",
  padding: "20px",
  borderRadius: "16px",
  fontWeight: "bold",
  boxShadow: "0 0 20px rgba(255, 215, 0, 0.7)",
  textAlign: "center",
  maxWidth: "92%",
  margin: "0 auto",
  border: "2px solid #c8b900",
  fontFamily: "'Orbitron', sans-serif",
        }}
      >
        {isActive ? (
          <>
            <h3 style={{
  fontSize: "22px",
  color: "#d4af37",
  textShadow: "1px 1px 4px #000",
  marginBottom: "10px"
}}>
  SR рейтинг игрока: {srRating}
</h3>
            <p style={{ fontSize: "14px", lineHeight: "1.5", color: "#333" }}>
  Подписка активна до: <b style={{ color: "#4caf50" }}>{expires?.toLocaleDateString()}</b><br />
  <small style={{ color: "#555" }}>
    Подписка действует до конца следующего месяца независимо от даты покупки
  </small>
</p>
{isActive && !walletSaved && (
  <button
    className="wallet-button"
    onClick={() => setShowWalletModal(true)}
    style={{
      marginTop: "16px",
      background: "#4caf50",
      padding: "10px 18px",
      borderRadius: "10px",
      color: "#fff",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer"
    }}
  >
    💳 Введите адрес TRC20-кошелька для получения бонуса
  </button>
)}
          </>
          ) : (
          <>
            <h3>SR рейтинг недоступен</h3>
            <p>Подписка не активна или истекла.</p>
          </>
        )}
      </div>
      <div style={{
  margin: "30px auto",
  padding: "20px",
  background: "rgba(0, 0, 0, 0.6)",
  borderRadius: "16px",
  textAlign: "center",
  color: "#fff",
  maxWidth: "90%",
  boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)"
}}>
  <h2 style={{
    marginBottom: "10px",
    fontSize: "20px",
    color: "#ffe082",
    textShadow: "1px 1px 3px #000"
  }}>
    💰 Общий игровой бонус:
  </h2>
  {fund !== null ? (
    <div style={{
      fontSize: "32px",
      fontWeight: "bold",
      color: "#ffd700",
      textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
      background: "linear-gradient(90deg, #fff176, #ffd54f, #ffb300)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      {fund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
  ) : (
    <span>Загрузка…</span>
  )}
</div>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "24px",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "12px",
          background: "linear-gradient(to bottom, #ffe259, #ffa751)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 0 10px #ffca28",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        🔙 Назад
      </button>
      {showWalletModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>💳 Адрес TRC20-кошелька</h3>
      <p>Укажите ваш TRC20-адрес (USDT, сеть TRON). Важно: проверьте, чтобы адрес был корректным.</p>
      <input
        type="text"
        placeholder="T... (34 символа)"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="wallet-input"
      />
      <button
        onClick={async () => {
          if (!walletAddress.startsWith("T") || walletAddress.length !== 34) {
            alert("❌ Неверный формат адреса TRC20");
            return;
          }

          const res = await fetch("https://mmmgo-backend.onrender.com/player/wallet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              telegramId: playerData.telegramId,
              walletAddressTRC20: walletAddress,
            }),
          });

          const data = await res.json();
          if (data.success) {
            setWalletSaved(true);
            setShowWalletModal(false);
            alert("✅ Адрес успешно сохранён");
          } else {
            alert("🚫 Ошибка при сохранении адреса");
          }
        }}
        style={{
          marginTop: "12px",
          background: "#2196f3",
          padding: "8px 14px",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer"
        }}
      >
        💾 Сохранить адрес
      </button>
      <button
        onClick={() => setShowWalletModal(false)}
        style={{
          marginTop: "8px",
          background: "gray",
          padding: "6px 12px",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer"
        }}
      >
        ❌ Отмена
      </button>
    </div>
  </div>
)}
    </div>
  );
}