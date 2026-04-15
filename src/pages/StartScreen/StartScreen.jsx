import styles from "./StartScreen.module.css";
import { useEffect } from "react";

function StartScreen({ onStart }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Enter" && !e.repeat) {
        onStart();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onStart]);

  return (
    <section className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.title}>Word Game</h1>

        <p className={styles.subtitle}>
          Guess the word from the clue before the timer runs out.
        </p>

        <div className={styles.rules}>
          <p>• 1 clue per word</p>
          <p>• Hint reveals a random letter</p>
          <p>• Each hint lowers the word score</p>
          <p>• Finish all words before time ends</p>
        </div>

        <button type="button" className={styles.button} onClick={onStart}>
          Start Game
        </button>
      </div>
    </section>
  );
}

export default StartScreen;
