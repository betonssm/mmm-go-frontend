import React, { useState } from "react";
import './MMMGo.css';
import mavrodikFloating from "../assets/mavrodik_floating.png";

export default function MMMGo() {
  const [balance, setBalance] = useState(0);
  const [showMavrodik, setShowMavrodik] = useState(false);

  const handleClick = () => {
    const newBalance = balance + 100;
    setBalance(newBalance);

    if (newBalance % 1000 === 0) {
      setShowMavrodik(true);
      setTimeout(() => setShowMavrodik(false), 2000);
      // Звук добавим позже
    }
  };

  return (
    <div className="container">
      <h1>Баланс: {balance} мавродиков</h1>
      <button onClick={handleClick}>👆 Привлечь вкладчика</button>

      {showMavrodik && (
        <img
          src={mavrodikFloating}
          alt="Мавродик"
          className="floating-mavrodik"
        />
      )}
    </div>
  );
}