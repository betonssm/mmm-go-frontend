
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
    <li>🎯 Могут добывать до <strong>20 000 мавродиков в день</strong>.</li>
    <li>📅 Выполняют задания и участвуют в игровых активностях.</li>
    <li>💵 Могут приобрести <strong>+50 000 мавродиков</strong> в рамках поддержки проекта.</li>
    <li>🔄 После накопления 5 000 000 мавродиков могут обменять их на внутриигровые токены.</li>
    <li>🚫 Не участвуют в SR-системе и бонусных игровых активностях.</li>
  </ul>
</div>

<div className="space-y-3">
  <h2 className="text-xl font-semibold text-gray-800">⭐ Игроки с премиум-доступом</h2>
  <ul className="list-disc list-inside text-gray-700 space-y-1">
    <li>🎁 Получают <strong>+50 000 мавродиков</strong> сразу после активации.</li>
    <li>📈 Участвуют в системе SR и бонусных игровых ивентах.</li>
    <li>💵 Могут дополнительно активировать <strong>+50 000 мавродиков</strong>.</li>
    <li>💎 Накопленные токены MMMGO используются для доступа к новым возможностям и наградам.</li>
  </ul>
</div>

<div className="space-y-3">
  <h2 className="text-xl font-semibold text-gray-800">📈 Что такое SR?</h2>
  <p className="text-gray-700">
    SR — это внутриигровой рейтинг активности. Чем выше SR, тем больше доступно возможностей в игровых событиях.
  </p>
  <ul className="list-disc list-inside text-gray-700 space-y-1">
    <li>🗓️ Начисляется с 1-го числа месяца после активации премиума.</li>
    <li>⚡ Зависит от действий игрока: нажатий, приглашений, выполнения заданий и поддержки проекта.</li>
    <li>🏆 Используется для участия в игровых наградах и сезонных событиях.</li>
  </ul>
</div>

<div className="space-y-3">
  <h2 className="text-xl font-semibold text-gray-800">🎯 Цель игры</h2>
  <p className="text-gray-700">
    Добывай мавродики, развивайся, участвуй в миссиях и событиях. Получай токены MMMGO как внутриигровую награду за активность. 🚀
  </p>
</div>

<p style={{ color: "#ffe082", textAlign: "center", marginBottom: "20px" }}>
  💬 MMMGO — это игровое развлечение. Мы не обещаем доход, инвестиции или выплаты.
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
    </div>
  );
}