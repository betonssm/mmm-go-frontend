
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
          marginBottom: "20px",
          background: "rgba(255, 215, 0, 0.7)",
          color: "#000",
          fontSize: "18px",
          padding: "8px 15px",
          borderRadius: "12px",
          fontWeight: "bold",
          boxShadow: "0 0 10px #ffd700",
          zIndex: 10,
          textAlign: "center",
          maxWidth: "90%",
          margin: "0 auto",
        }}
      >
        {isActive ? (
          <>
            <h3>SR рейтинг игрока: {srRating}</h3>
            <p>Подписка активна до: {expires?.toLocaleDateString()}<br />
  <small>Подписка действует до конца следующего месяца независимо от даты покупки</small>
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
      <div style={{ marginTop: 12, padding: 12, background: "rgba(0,0,0,0.5)", borderRadius: 8, color: "#ffe082", textAlign: "center" }}>
      <h4>🎁 Общий игровой бонус:</h4>
{fund !== null
  ? <span>{fund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
  : <span>Загрузка…</span>}
</div>

      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000", marginBottom: "8px" }}>
        📊 SR Рейтинг Игрока
      </h2>

      {isActive ? (
        <p style={{ marginBottom: "8px", color: "#ffe082" }}>
          Твой SR рейтинг: <strong>{srRating}</strong>
        </p>
      ) : (
        <p style={{ marginBottom: "8px", color: "#ff8c00" }}>
          Приобретите или продлите премиум, чтобы начать накапливать SR очки.
        </p>
      )}

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