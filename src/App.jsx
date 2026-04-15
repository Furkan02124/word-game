import Game from "./pages/Game/Game.jsx";
import StartScreen from "./pages/StartScreen/StartScreen.jsx";
import Header from "./components/Header/Header.jsx";
import { useState } from "react";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [visible, setVisible] = useState(true);

  const TRANSITION_DURATION = 250;

  function handleStart() {
    setVisible(false);

    setTimeout(() => {
      setVisible(true);
      setGameStarted(true);
    }, TRANSITION_DURATION);
  }

  return (
    <div className="app">
      <Header />
      <main className={`screen-shell ${visible ? "is-visible" : "is-hidden"}`}>
        {gameStarted ? <Game /> : <StartScreen onStart={handleStart} />}
      </main>
    </div>
  );
}

export default App;
