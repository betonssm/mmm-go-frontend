
import React, { useEffect, useState } from "react";
import "./StartScreen.css";
import mavrodikClean from "../assets/mavrodik_clean.png";
import startButtonImg from "../assets/start_button.png";
import { useNavigate } from "react-router-dom";

export default function StartScreen({ onStart }: { onStart: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = mavrodikClean;

    img.onload = () => {
      setImageLoaded(true);

      // Показать кнопку с задержкой, чтобы избежать проблем отрисовки
      setTimeout(() => {
        setButtonVisible(true);
      }, 100); // 100 мс задержка — для стабильности на слабых устройствах
    };

    if (window.Telegram?.WebApp?.expand) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  const handleStart = () => {
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

            {buttonVisible && (
              <button className="start-button glow" onClick={handleStart}>
                <img src={startButtonImg} alt="Начать" />
              </button>
            )}

<div className="start-screen-footer">
              🎮 Это WebApp-игра в стиле 90-х. Все персонажи и валюты вымышлены.
              </div>
          </>
        )}
      </div>
    </div>
  );
}