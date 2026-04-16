import styles from "./GameStatus.module.css";
import { useEffect } from "react";

function GameStatus({ gameStatus, score, onRestart }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Enter" && !e.repeat && gameStatus !== "playing") {
        onRestart();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onRestart, gameStatus]);

  if (gameStatus === "playing") return null;

  const isWon = gameStatus === "won";

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2 className={styles.title}>{isWon ? "You Won!" : "Game Over"}</h2>

        <p className={styles.subtitle}>
          {isWon ? "You finished all words!" : "Time’s up!"}
        </p>

        <p className={styles.score}>Final Score: {score}</p>

        <button type="button" className={styles.button} onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameStatus;
