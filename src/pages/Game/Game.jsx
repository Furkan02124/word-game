import { useState, useCallback, useEffect } from "react";
import styles from "./Game.module.css";

import WordDisplay from "@/components/WordDisplay/WordDisplay";
import ClueBox from "@/components/ClueBox/ClueBox";
import GuessInput from "@/components/GuessInput/GuessInput";
import HintButton from "@/components/HintButton/HintButton";
import Timer from "@/components/Timer/Timer";
import ScoreBoard from "@/components/ScoreBoard/ScoreBoard";
import GameStatus from "@/components/GameStatus/GameStatus";
import GuessHistory from "@/components/GuessHistory/GuessHistory";

import useCountdown from "@/hooks/useCountdown";
import { playCorrect, playWin, playWrong, toggleMute } from "@/utils/sound";
import { randomIndex, getDisplayLetters, getMergedGuess } from "@/utils/tools";
import { buildDifficultyGameWords } from "@/utils/wordPicker";

const WORD_COUNT = 2;
const TILE_SIZE = 60;
const TILE_GAP = 8;

function Game({ isMuted, onBackToStart }) {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [revealedIndexes, setRevealedIndexes] = useState([]);
  const [usedHintsForWord, setUsedHintsForWord] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameStatus, setGameStatus] = useState("playing");
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [guessHistory, setGuessHistory] = useState([]);
  const [justSolved, setJustSolved] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [isAdvancingWord, setIsAdvancingWord] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bestScore, setBestScore] = useState(() => {
    return Number(localStorage.getItem("bestScore")) || 0;
  });

  const isPlaying = gameStatus === "playing";

  useEffect(() => {
    loadWords();
  }, []);

  useEffect(() => {
    if (isMuted) {
      toggleMute();
    }
  }, [isMuted]);

  const updateBestScore = useCallback(
    (finalScore) => {
      if (finalScore <= bestScore) return;

      setBestScore(finalScore);
      localStorage.setItem("bestScore", String(finalScore));
    },
    [bestScore]
  );

  const handleTimeExpire = useCallback(() => {
    updateBestScore(score);
    setGameStatus("lost");
    setMessage("Time's up!");
  }, [score, updateBestScore]);

  useCountdown({
    isRunning: isPlaying,
    timeLeft,
    setTimeLeft,
    onExpire: handleTimeExpire,
  });

  if (isLoading) {
    return <div className={styles.container}>Loading words...</div>;
  }

  if (!shuffledWords.length) {
    return <div className={styles.container}>Could not load words.</div>;
  }

  function loadWords() {
    setIsLoading(true);

    try {
      const words = buildDifficultyGameWords();
      setShuffledWords(words);
    } catch (error) {
      console.error("WordBank load failed:", error);
      setShuffledWords([]);
    } finally {
      setIsLoading(false);
    }
  }

  const currentWord = shuffledWords[currentWordIndex];
  const answer = currentWord.answer;
  const clue = currentWord.clue[0].toUpperCase() + currentWord.clue.slice(1);
  const wordLength = answer.length;
  const availableSlots = wordLength - revealedIndexes.length;
  const roundPoints = Math.max(wordLength * 20 - usedHintsForWord * 20, 0);
  const hasHiddenLetters = revealedIndexes.length < wordLength;
  const displayLetters = getDisplayLetters(answer, guess, revealedIndexes);
  const mergedGuess = getMergedGuess(answer, guess, revealedIndexes);

  function handleRestartGame() {
    setCurrentWordIndex(0);
    setGuess("");
    setMessage("");
    setScore(0);
    setRevealedIndexes([]);
    setUsedHintsForWord(0);
    setGuessHistory([]);
    setTimeLeft(180);
    setGameStatus("playing");
    setFocusTrigger((prev) => prev + 1);
    loadWords();
  }

  function handleSubmitGuess() {
    if (!isPlaying || isAdvancingWord) return;

    const cleanedGuess = mergedGuess.trim().toUpperCase();

    if (cleanedGuess.length !== wordLength || displayLetters.includes("")) {
      setMessage(`Guess must be ${wordLength} letters.`);
      return;
    }

    if (cleanedGuess === answer) {
      setIsAdvancingWord(true);
      setMessage("Correct!");
      playCorrect();
      setJustSolved(true);

      setTimeout(() => {
        setJustSolved(false);

        const newScore = score + roundPoints;
        setScore(newScore);

        const isLastWord = currentWordIndex === WORD_COUNT - 1;

        if (isLastWord) {
          setGameStatus("won");
          playWin();
          updateBestScore(newScore);
          setMessage("You completed all words!");
          setIsAdvancingWord(false);
          return;
        }

        setCurrentWordIndex((prev) => prev + 1);
        setGuess("");
        setRevealedIndexes([]);
        setUsedHintsForWord(0);
        setGuessHistory([]);
        setMessage("");
        setIsAdvancingWord(false);
      }, 600);

      return;
    }
    setGuessHistory((prev) => [...prev, cleanedGuess]);
    setIsWrong(true);
    playWrong();
    setMessage("Wrong!");

    setTimeout(() => {
      setIsWrong(false);
    }, 350);

    setGuess("");
    setFocusTrigger((prev) => prev + 1);
  }

  function handleHint() {
    if (!isPlaying || isAdvancingWord) return;

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
        <div className={styles.left}>
          <ScoreBoard
            score={score}
            currentRound={currentWordIndex + 1}
            totalWords={WORD_COUNT}
            roundPoints={roundPoints}
            bestScore={bestScore}
          />
        </div>
        <div className={styles.spacer} />
        <div className={styles.right}>
          <Timer timeLeft={timeLeft} />
        </div>
      </div>

      <div className={styles.main}>
        <section className={styles.gameArea}>
          <WordDisplay
            letters={displayLetters}
            isCorrect={justSolved}
            isWrong={isWrong}
          />
          <div className={styles.controlSection}>
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
              disabled={!isPlaying || isAdvancingWord}
              focusTrigger={focusTrigger}
            />

            <HintButton
              btnText="Hint"
              onHint={handleHint}
              disabled={!isPlaying || !hasHiddenLetters || isAdvancingWord}
            />
          </div>

          <p className={styles.message}>{message ? message : ""}</p>
          <GuessHistory guesses={guessHistory} />
        </section>
      </div>
      <GameStatus
        gameStatus={gameStatus}
        score={score}
        onRestart={handleRestartGame}
        onBackToStart={onBackToStart}
      />
    </div>
  );
}

export default Game;
