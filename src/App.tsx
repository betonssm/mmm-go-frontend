
import React, { useState } from "react";
import MMMGo from "./pages/MMMGo";
import StartScreen from "./pages/StartScreen";

function App() {
  const [started, setStarted] = useState(false);
  return started ? <MMMGo /> : <StartScreen onStart={() => setStarted(true)} />;
}

export default App;
