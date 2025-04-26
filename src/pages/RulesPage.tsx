
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // Убедитесь, что стили подключены правильно

export default function RulesPage() {
  const navigate = useNavigate();
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/bg-rules.png";
    img.onload = () => setBgLoaded(true);
  }, []);

  if (!bgLoaded) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return (
    <div
    className="rules-page-container flex flex-col items-center justify-start min-h-screen"
    style={{
      backgroundImage: `url(/assets/bg-rules.png)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "30px 20px",
      boxSizing: "border-box",
    }}
    >
      <div className="rules-content">
      <div className="p-4 space-y-6 bg-white bg-opacity-70 rounded-xl shadow-lg max-w-3xl mx-auto">
  <h1 className="text-2xl font-bold text-yellow-600 mb-4">📜 Правила игры MMMGO</h1>

  <div className="space-y-3">
    <h2 className="text-xl font-semibold text-gray-800">👤 Бесплатные игроки</h2>
    <ul className="list-disc list-inside text-gray-700 space-y-1">
      <li>🎯 Могут добывать до <strong>20 000 мавродиков в день</strong> обычным нажатием.</li>
      <li>📅 Выполняют ежедневные и недельные задания для получения бонусов.</li>
      <li>💵 Могут докупить <strong>+50 000 мавродиков</strong> за $10.</li>
      <li>🔄 Могут обменивать накопленные мавродики на токены после достижения <strong>5 000 000</strong>.</li>
      <li>🚫 Не участвуют в распределении фонда и не имеют SR-рейтинг.</li>
    </ul>
  </div>

  <div className="space-y-3">
    <h2 className="text-xl font-semibold text-gray-800">⭐ Игроки с подпиской</h2>
    <ul className="list-disc list-inside text-gray-700 space-y-1">
      <li>🎁 При оплате подписки получают сразу <strong>+50 000 мавродиков</strong> на баланс.</li>
      <li>📈 Начинают зарабатывать SR-баллы для участия в распределении фонда.</li>
      <li>💵 Могут докупить <strong>+50 000 мавродиков</strong> за $10.</li>
      <li>💎 После накопления токенов MMMGO участвуют в бонусных выплатах в токенах.</li>
    </ul>
  </div>

  <div className="space-y-3">
    <h2 className="text-xl font-semibold text-gray-800">📈 Что такое SR-рейтинг?</h2>
    <p className="text-gray-700">
      SR (Share Rating) — это ваш инвестиционный рейтинг. Чем выше SR, тем большую долю фонда вы получите.
    </p>
    <ul className="list-disc list-inside text-gray-700 space-y-1">
      <li>🗓️ Начисление SR начинается <strong>с 1-го числа следующего месяца</strong> после оформления подписки.</li>
      <li>⚡ Баллы SR зависят от активности: тапов, рефералов, заданий и донатов.</li>
      <li>🏆 Фонд распределяется среди топ-10% игроков с самым высоким SR.</li>
    </ul>
  </div>

  <div className="space-y-3">
    <h2 className="text-xl font-semibold text-gray-800">🎯 Цель игры</h2>
    <p className="text-gray-700">
      Добывайте мавродики, выполняйте задания, приглашайте друзей и зарабатывайте токены MMMGO! 
      Стремитесь попасть в топ-10% инвесторов и получить свою долю фонда! 🚀
    </p>
  </div>
</div>

<p style={{ color: "#ffe082", textAlign: "center", marginBottom: "20px" }}>
  💬 Это игра, а не финансовый инструмент. Никаких инвестиций, гарантий дохода или обещаний прибыли не предусмотрено.
</p>
<p style={{ color: "#ffe082", textAlign: "center", marginBottom: "30px" }}>
  🔗 <a href="https://example.com/rules" target="_blank" rel="noopener noreferrer" style={{ color: "#ffe082", textDecoration: "underline" }}>
    Читать полные правила
  </a>
</p>

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
        Принять
      </button>
    </div>
    </div>
  );
}