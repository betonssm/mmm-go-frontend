
import React, { useEffect, useState } from "react";
import "./StartScreen.css";
import mavrodikClean from "../assets/mavrodik_clean.png";
import startButtonImg from "../assets/start_button.png";
import { useNavigate } from "react-router-dom";

export default function StartScreen({ onStart }: { onStart: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = mavrodikClean;
    img.onload = () => setImageLoaded(true);

    // Попытка развернуть WebApp при загрузке
    if (window.Telegram?.WebApp?.expand) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  const handleStart = () => {
    // Повторно разворачиваем WebApp, если не развернулся автоматически
    if (window.Telegram?.WebApp?.expand) {
      window.Telegram.WebApp.expand();
    }

    onStart();
  };

  return (
    <div className="start-wrapper">
      <div className="start-box">
        {!imageLoaded ? (
          <div className="loading-screen">Загрузка...</div>
        ) : (
          <>
            <img
              src={mavrodikClean}
              alt="Мавродик"
              className="start-image"
              loading="eager"
              onClick={handleStart}
            />
            <button className="start-button glow" onClick={handleStart}>
              <img src={startButtonImg} alt="Начать" />
            </button>
            <p className="disclaimer-text">
  🎮 Это WebApp-игра в стиле 90-х. Все персонажи и валюты вымышлены.
</p>
          </>
        )}
      </div>
    </div>
  );
}