
import React from "react";
import "./StartScreen.css";
import mavrodikImg from "../assets/mavrodik_clean.png";
import buttonImg from "../assets/start_button.png";
import coinSound from "../assets/coin.mp3";

export default function StartScreen({ onStart }: { onStart: () => void }) {
  const playSoundAndStart = () => {
    const audio = new Audio(coinSound);
    audio.play().catch((e) => console.log("Audio play error:", e));
    onStart();
  };

  return (
    <div className="start-wrapper">
      <div className="start-box">
        <img src={mavrodikImg} alt="Мавродик" className="start-image" />
        <button className="start-button glow" onClick={playSoundAndStart}>
          <img src={buttonImg} alt="Начать" />
        </button>
      </div>
    </div>
  );
}