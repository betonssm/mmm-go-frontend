
import React from "react";
import "./StartScreen.css";
import mavrodikImg from "../assets/mavrodik_clean.png";
import buttonImg from "../assets/start_button.png";

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="start-wrapper">
      <div className="start-image-container">
        <img src={mavrodikImg} alt="Мавродик" className="start-image" />
        <button className="start-button" onClick={onStart}>
          <img src={buttonImg} alt="Начать" />
        </button>
      </div>
    </div>
  );
}