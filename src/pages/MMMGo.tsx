import React, { useState } from "react";
import './MMMGo.css';

export default function MMMGo() {
  const [balance, setBalance] = useState(0);

  return (
    <div className="container">
      <h1>Баланс: {balance} мавродиков</h1>
      <button onClick={() => setBalance(balance + 100)}>👆 Привлечь вкладчика</button>
    </div>
  );
}
