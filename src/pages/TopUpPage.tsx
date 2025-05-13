import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TopUpPage.css";
import { TonConnectWrapper, TonConnectButtonUI } from "../lib/TonWalletConnect";
import { useTonConnectUI } from "@tonconnect/ui-react";

export default function TopUpPage() {
  return (
    <TonConnectWrapper>
      <TopUpPageContent />
    </TonConnectWrapper>
  );
}

function TopUpPageContent() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [isPremiumLoading, setPremiumLoading] = useState(false);
  const [isBuyLoading, setBuyLoading] = useState(false);
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/bg-topup.png";
    img.onload = () => setBgLoaded(true);

    const initData = window.Telegram?.WebApp?.initData;
    const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe;

    fetch("https://mmmgo-backend.onrender.com/player/log-init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        initData: initData || "undefined",
        initDataUnsafe: initDataUnsafe || "undefined",
      }),
    });
  }, []);

  useEffect(() => {
    const wallet = tonConnectUI.account;
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

    if (wallet?.address && telegramId) {
      fetch("https://mmmgo-backend.onrender.com/player/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, tonWallet: wallet.address }),
      });
    }
  }, [tonConnectUI.account]);

  const handleTonPayment = async (amountTON, type) => {
  try {
    const wallet = tonConnectUI.account;
    if (!wallet) {
      alert("Пожалуйста, подключите TON кошелёк перед оплатой.");
      return;
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [
        {
          address: "UQDh-x69UU3p5DWPZ8Yz_4QMoTWwkAWYLMy6JoQSOPxLPT8A",
          amount: (amountTON * 1e9).toString(),
        },
      ],
    };

    console.log("📤 Отправляем транзакцию TON:", transaction);
    await tonConnectUI.sendTransaction(transaction);
    console.log("✅ Транзакция отправлена");

    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (!telegramId) return alert("Ошибка: нет Telegram ID");

    // 🔁 ЗАДЕРЖКА для попадания транзакции в блокчейн
    console.log("⏳ Ждём 5 секунд перед проверкой оплаты...");
    await new Promise((r) => setTimeout(r, 5000));

    console.log("📦 Отправляем запрос на backend для проверки оплаты...");
    const res = await fetch("https://mmmgo-backend.onrender.com/api/payments/check-ton", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId, type }),
    });

    const data = await res.json();
    console.log("📋 Ответ от backend:", data);

    if (data.ok) {
      alert(type === "premium" ? "🎉 Премиум активирован!" : "💰 Мавродики начислены!");
    } else {
      alert("Оплата отправлена, но начисление не выполнено. Обратитесь в поддержку.");
    }
  } catch (err) {
    console.error("❌ Ошибка при отправке TON:", err);
    alert("Ошибка при оплате или отмена.");
  }
};

  if (!bgLoaded) return <div className="loading-screen">Загрузка...</div>;

  return (
    <div
      className="topup-container"
      style={{
        backgroundImage: `url(/assets/bg-topup.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "30px 16px 60px",
        boxSizing: "border-box",
      }}
    >
      {(isPremiumLoading || isBuyLoading) && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Обработка запроса...</p>
        </div>
      )}

      <div className="note-box">
        <h1>🎁 Премиум-доступ</h1>
        <p>Разблокируй расширенные возможности и бонусы!</p>
      </div>

     <div className="wallet-button-wrapper">
  <TonConnectButtonUI />
</div>
      <div className="payment-options">
        <div className="payment-option">
          <button
            onClick={() => {
              setPremiumLoading(true);
              handleTonPayment(1.0, "premium").finally(() => setPremiumLoading(false));
            }}
          >
            {isPremiumLoading ? "⏳ Ожидание..." : "🚀 Получить премиум (3.1 TON ≈ $10)"}
          </button>

          <button
            onClick={() => {
              setBuyLoading(true);
              handleTonPayment(1.2, "topup").finally(() => setBuyLoading(false));
            }}
          >
            {isBuyLoading ? "⏳ Ожидание..." : "💰 Купить 50 000 мавродиков (3.2 TON ≈ $10)"}
          </button>
        </div>
      </div>

      <div className="note-box">
        💡 После оплаты новые функции активируются автоматически. Платёж обрабатывается через Telegram.
      </div>

      <div className="note-box">
        🔐 Мы не запрашиваем доступ к твоим деньгам напрямую. Все операции проходят через Telegram-интерфейс оплаты.
      </div>

      <Link to="/">
        <button className="back-btn">⬅ Вернуться в игру</button>
      </Link>
    </div>
  );
}