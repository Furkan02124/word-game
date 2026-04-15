import WordDisplay from "../components/WordDisplay/WordDisplay";
import ClueBox from "../components/ClueBox/ClueBox";
import GuessInput from "../components/GuessInput/GuessInput";
import HintButton from "../components/HintButton/HintButton";
import Timer from "../components/Timer/Timer";
import ScoreBoard from "../components/ScoreBoard/ScoreBoard";
import styles from "./Game.module.css";
import words from "../data/words";
import { useState, useCallback } from "react";
import useCountdown from "../hooks/useCountdown";
import {
  shuffleArray,
  randomIndex,
  getDisplayLetters,
  getMergedGuess,
} from "../utils/tools";

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

  const isPlaying = gameStatus === "playing";
  const isWon = gameStatus === "won";
  const totalWords = shuffledWords.length;
  const tileSize = 60;
  const tileGap = 8;
  const wordSectionWidth = wordLength * tileSize + (wordLength - 1) * tileGap;

  const displayLetters = getDisplayLetters(answer, guess, revealedIndexes);
  const mergedGuess = getMergedGuess(answer, guess, revealedIndexes);

  const handleTimeExpire = useCallback(() => {
    setGameStatus("lost");
    setMessage("Time's up!");
  }, []);

  useCountdown({
    isRunning: isPlaying,
    timeLeft,
    setTimeLeft,
    onExpire: handleTimeExpire,
  });

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
    if (!isPlaying) return;

    const cleanedGuess = guess.trim().toUpperCase();

    if (cleanedGuess.length !== wordLength || displayLetters.includes("")) {
      setMessage(`Guess must be ${wordLength} letters.`);
      return;
    }

    if (cleanedGuess === answer) {
      setMessage("Correct!");
      setScore((prev) => prev + roundPoints);
      setGuess("");

      if (currentWordIndex < totalWords - 1) {
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
    if (!isPlaying) return;

    const hiddenIndexes = [];

    for (let i = 0; i < answer.length; i++) {
      if (!revealedIndexes.includes(i)) {
        hiddenIndexes.push(i);
      }
    }

    if (hiddenIndexes.length === 0) {
      setMessage("All letters are already revealed.");
      return;
    }

    const selectedIndex = hiddenIndexes[randomIndex(hiddenIndexes.length)];

    setRevealedIndexes((prev) =>
      [...prev, selectedIndex].sort((a, b) => a - b)
    );
    setUsedHintsForWord((prev) => prev + 1);
    setGuess("");
    setMessage("A letter was revealed.");
    setFocusTrigger((prev) => prev + 1);
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
              disabled={!isPlaying}
              focusTrigger={focusTrigger}
            />

            <HintButton
              btnText="Hint"
              onHint={handleHint}
              disabled={!isPlaying || availableSlots === 0}
            />
          </div>

          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
      {!isPlaying && (
        <div className={styles.overlay}>
          <div className={styles.gameOverCard}>
            <h2 className={styles.gameOverTitle}>
              {isWon ? "You Won!" : "Game Over"}
            </h2>
            <p className={styles.gameOverText}>
              {isWon ? "You finished all words!" : "Time’s up!"}
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
