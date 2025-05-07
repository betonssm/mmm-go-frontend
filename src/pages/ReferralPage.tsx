
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css";

export default function ReferralPage() {
  const [referrals, setReferrals] = useState(0);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const navigate = useNavigate();
  const [referralEarnings, setReferralEarnings] = useState(0);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (user) {
      setTelegramId(user.id);

      fetch(`https://mmmgo-backend.onrender.com/player/${user.id}`)
  .then(res => res.json())
  .then(data => {
    setReferrals(data.referrals || 0);
    setReferralEarnings(data.referralEarnings || 0);
  });

      fetch("https://mmmgo-backend.onrender.com/player/count")
        .then(res => res.json())
        .then(data => {
          setTotalPlayers(data.totalPlayers || 0);
        });
    }

    const img = new Image();
    img.src = "/assets/bg-investors.png";
    img.onload = () => setBgLoaded(true);
  }, []);

  const copyReferralLink = () => {
    if (!telegramId) return;

    const link = `https://t.me/mmmgo_bot?start=${telegramId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!bgLoaded) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(/assets/bg-investors.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "30px",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000" }}>👥 Приглашай друзей в игру</h2>

      <p style={{ color: "#fff" }}>
      Приглашено друзей: <strong>{referrals}</strong>
      </p>

      <p style={{ color: "#fff" }}>
        Всего игроков в системе: <strong>{totalPlayers}</strong>
      </p>
      <p style={{ color: "#fff" }}>
  🎁 Получено бонусов от друзей: <strong>{referralEarnings}</strong>
</p>
      <p style={{ color: "#fff", marginTop: "20px", fontStyle: "italic" }}>
      Скопируй свою личную ссылку и поделись с другом. При первом входе он будет отмечен как твой приглашённый.
      </p>

      <button
        onClick={copyReferralLink}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "12px",
          background: "linear-gradient(to bottom, #90ee90, #32cd32)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 0 10px #32cd32",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        📎 Пригласить друга
      </button>

      {copied && (
        <div
          style={{
            marginTop: "15px",
            color: "#fff",
            background: "rgba(0,0,0,0.6)",
            padding: "10px 20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          ✅ Ссылка скопирована!
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "30px",
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
    </div>
  );
}
