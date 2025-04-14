
import React, { useEffect, useState } from "react";
import "./StartScreen.css";
import mavrodikClean from "../assets/mavrodik_clean.png";
import startButtonImg from "../assets/start-button.png";
import { useNavigate } from "react-router-dom";

export default function StartScreen() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const img = new Image();
    img.src = mavrodikClean;
    img.onload = () => setImageLoaded(true);
  }, []);

  const handleStart = () => {
    navigate("/game");
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
          </>
        )}
      </div>
    </div>
  );
}