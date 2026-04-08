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
import { useState } from "react";

function Game() {
  const [shuffledWords] = useState(() => shuffleArray(words));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [revealedIndexes, setRevealedIndexes] = useState([]);
  const [usedHintsForWord, setUsedHintsForWord] = useState(0);

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

  function handleSubmitGuess() {
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
      } else {
        setMessage("You finished all words!");
      }
    } else {
      setMessage("Wrong!");
      setGuess("");
    }
  }

  function handleHint() {
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
        <Timer />
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
            />

            <HintButton btnText="Hint" onHint={handleHint} />
          </div>

          {message && <p className={styles.message}>{message}</p>}
        </div>

        <SidePanel />
      </div>
    </div>
  );
}

export default Game;
