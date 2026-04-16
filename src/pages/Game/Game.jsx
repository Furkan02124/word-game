import WordDisplay from "@/components/WordDisplay/WordDisplay";
import ClueBox from "@/components/ClueBox/ClueBox";
import GuessInput from "@/components/GuessInput/GuessInput";
import HintButton from "@/components/HintButton/HintButton";
import Timer from "@/components/Timer/Timer";
import ScoreBoard from "@/components/ScoreBoard/ScoreBoard";
import GameStatus from "@/components/GameStatus/GameStatus";
import GuessHistory from "@/components/GuessHistory/GuessHistory";
import styles from "./Game.module.css";
import fallbackWords from "@/data/words";
import { fetchGameWords } from "@/services/wordApi";
import { playCorrect, playWin, playWrong } from "@/utils/sound";
import { useState, useCallback, useEffect } from "react";
import useCountdown from "@/hooks/useCountdown";
import {
  shuffleArray,
  randomIndex,
  getDisplayLetters,
  getMergedGuess,
} from "@/utils/tools";

const WORD_COUNT = 12;
const TILE_SIZE = 60;
const TILE_GAP = 8;

function Game() {
  const [gameWords, setGameWords] = useState([]);
  const [shuffledWords, setShuffledWords] = useState(() =>
    shuffleArray(gameWords)
  );
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

  const isPlaying = gameStatus === "playing";

  useEffect(() => {
    async function loadWords() {
      try {
        const apiWords = await fetchGameWords(WORD_COUNT);
        const shuffled = shuffleArray(apiWords);
        setGameWords(apiWords);
        setShuffledWords(shuffled);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        const shuffled = shuffleArray(fallbackWords);
        setGameWords(fallbackWords);
        setShuffledWords(shuffled);
      } finally {
        setIsLoading(false);
      }
    }

    loadWords();
  }, []);

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

  if (isLoading) {
    return <div className={styles.container}>Loading words...</div>;
  }

  if (!shuffledWords.length) {
    return <div className={styles.container}>Could not load words.</div>;
  }

  const currentWord = shuffledWords[currentWordIndex];
  const answer = currentWord.answer;
  const clue = currentWord.clue;
  const wordLength = answer.length;
  const availableSlots = wordLength - revealedIndexes.length;
  const roundPoints = Math.max(wordLength * 20 - usedHintsForWord * 20, 0);
  const hasHiddenLetters = revealedIndexes.length < wordLength;
  const wordSectionWidth = wordLength * TILE_SIZE + (wordLength - 1) * TILE_GAP;
  const displayLetters = getDisplayLetters(answer, guess, revealedIndexes);
  const mergedGuess = getMergedGuess(answer, guess, revealedIndexes);

  function handleRestartGame() {
    setShuffledWords(shuffleArray(gameWords));
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
        <ScoreBoard
          score={score}
          currentRound={currentWordIndex + 1}
          totalWords={WORD_COUNT}
          roundPoints={roundPoints}
        />
        <Timer timeLeft={timeLeft} />
      </div>

      <div className={styles.main}>
        <div className={styles.gameArea}>
          <div
            className={styles.wordSection}
            style={{ width: `${wordSectionWidth}px` }}
          >
            <WordDisplay
              letters={displayLetters}
              isCorrect={justSolved}
              isWrong={isWrong}
            />

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
        </div>
      </div>
      <GameStatus
        gameStatus={gameStatus}
        score={score}
        onRestart={handleRestartGame}
      />
    </div>
  );
}

export default Game;
