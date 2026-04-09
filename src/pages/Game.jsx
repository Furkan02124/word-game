import WordDisplay from "../components/WordDisplay/WordDisplay";
import ClueBox from "../components/ClueBox/ClueBox";
import GuessInput from "../components/GuessInput/GuessInput";
import HintButton from "../components/HintButton/HintButton";
import SidePanel from "../components/SidePanel/SidePanel";
import Timer from "../components/Timer/Timer";
import ScoreBoard from "../components/ScoreBoard/ScoreBoard";
import styles from "./Game.module.css";
import words from "../data/words";
import { shuffleArray, randomIndex } from "../utils/tools";
import { useState, useEffect } from "react";

function Game() {
  const [shuffledWords, setShuffledWords] = useState(() => shuffleArray(words));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [revealedIndexes, setRevealedIndexes] = useState([]);
  const [usedHintsForWord, setUsedHintsForWord] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameStatus, setGameStatus] = useState("playing");
  const [focusTrigger, setFocusTrigger] = useState(0);

  const currentWord = shuffledWords[currentWordIndex];
  const answer = currentWord.answer;
  const clue = currentWord.clue;
  const wordLength = answer.length;
  const availableSlots = wordLength - revealedIndexes.length;
  const roundPoints = Math.max(100 - usedHintsForWord * 20, 0);

  const tileSize = 60;
  const tileGap = 8;
  const wordSectionWidth = wordLength * tileSize + (wordLength - 1) * tileGap;

  const displayLetters = [];
  let typedIndex = 0;

  for (let i = 0; i < wordLength; i++) {
    if (revealedIndexes.includes(i)) {
      displayLetters.push(answer[i]);
    } else {
      displayLetters.push(guess[typedIndex] || "");
      typedIndex++;
    }
  }

  const mergedGuess = displayLetters.join("");

  useEffect(() => {
    if (gameStatus !== "playing") return;

    if (timeLeft <= 0) {
      setGameStatus("lost");
      setMessage("Time's up!");
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, gameStatus]);

  function handleRestartGame() {
    setShuffledWords(shuffleArray(words));
    setCurrentWordIndex(0);
    setGuess("");
    setMessage("");
    setScore(0);
    setRevealedIndexes([]);
    setUsedHintsForWord(0);
    setTimeLeft(180);
    setGameStatus("playing");
    setFocusTrigger((prev) => prev + 1);
  }
  function handleSubmitGuess() {
    if (gameStatus !== "playing") return;

    const fullGuess = [];
    let typedIndex = 0;

    for (let i = 0; i < wordLength; i++) {
      if (revealedIndexes.includes(i)) {
        fullGuess.push(answer[i]);
      } else {
        fullGuess.push(guess[typedIndex] || "");
        typedIndex++;
      }
    }

    const cleanedGuess = fullGuess.join("").trim().toUpperCase();

    if (cleanedGuess.length !== wordLength || fullGuess.includes("")) {
      setMessage(`Guess must be ${wordLength} letters.`);
      return;
    }

    if (cleanedGuess === answer) {
      setMessage("Correct!");
      setScore((prev) => prev + roundPoints);
      setGuess("");

      if (currentWordIndex < shuffledWords.length - 1) {
        setCurrentWordIndex((prev) => prev + 1);
        setRevealedIndexes([]);
        setUsedHintsForWord(0);
        setFocusTrigger((prev) => prev + 1);
      } else {
        setGameStatus("won");
        setMessage("You finished all words!");
      }
    } else {
      setMessage("Wrong!");
      setGuess("");
    }
  }

  function handleHint() {
    if (gameStatus !== "playing") return;

    const hiddenIndexes = [];

    for (let i = 0; i < answer.length; i++) {
      if (!revealedIndexes.includes(i)) {
        hiddenIndexes.push(i);
      }
    }

    if (hiddenIndexes.length > 0) {
      const randomHiddenPosition = randomIndex(hiddenIndexes.length);
      const selectedIndex = hiddenIndexes[randomHiddenPosition];

      setRevealedIndexes((prev) => [...prev, selectedIndex]);
      setUsedHintsForWord((prev) => prev + 1);
      setMessage("A letter was revealed.");
      return;
    }

    setMessage("All letters are already revealed.");
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <ScoreBoard score={score} />
        <Timer timeLeft={timeLeft} />
      </div>

      <div className={styles.main}>
        <div className={styles.gameArea}>
          <div
            className={styles.wordSection}
            style={{ width: `${wordSectionWidth}px` }}
          >
            <WordDisplay letters={displayLetters} />

            <ClueBox clue={clue} />

            <GuessInput
              guess={guess}
              mergedGuess={mergedGuess}
              setGuess={setGuess}
              placeholderText="Type your guess..."
              guessBtnText="Guess"
              onSubmitGuess={handleSubmitGuess}
              setMessage={setMessage}
              availableSlots={availableSlots}
              revealedIndexes={revealedIndexes}
              wordLength={wordLength}
              answer={answer}
              disabled={gameStatus !== "playing"}
              focusTrigger={focusTrigger}
            />

            <HintButton
              btnText="Hint"
              onHint={handleHint}
              disabled={gameStatus !== "playing"}
            />
          </div>

          {message && <p className={styles.message}>{message}</p>}
        </div>

        <SidePanel />
      </div>
      {gameStatus !== "playing" && (
        <div className={styles.overlay}>
          <div className={styles.gameOverCard}>
            <h2 className={styles.gameOverTitle}>
              {gameStatus === "won" ? "You Won!" : "Game Over"}
            </h2>
            <p className={styles.gameOverText}>
              {gameStatus === "won" ? "You finished all words!" : "Time’s up!"}
            </p>
            <p className={styles.finalScore}>Final Score: {score}</p>
            <button className={styles.restartBtn} onClick={handleRestartGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
