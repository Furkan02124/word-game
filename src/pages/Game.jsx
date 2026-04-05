import WordDisplay from "../components/WordDisplay/WordDisplay";
import ClueBox from "../components/ClueBox/ClueBox";
import GuessInput from "../components/GuessInput/GuessInput";
import HintButton from "../components/HintButton/HintButton";
import SidePanel from "../components/SidePanel/SidePanel";
import Timer from "../components/Timer/Timer";
import ScoreBoard from "../components/ScoreBoard/ScoreBoard";
import styles from "./Game.module.css";
import { useState } from "react";

function Game() {
  const wordLength = 6;
  const tileSize = 60;
  const tileGap = 8;
  const wordSectionWidth = wordLength * tileSize + (wordLength - 1) * tileGap;

  const [guess, setGuess] = useState("");
  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <ScoreBoard />
        <Timer />
      </div>

      <div className={styles.main}>
        <div className={styles.gameArea}>
          <div
            className={styles.wordSection}
            style={{ width: `${wordSectionWidth}px` }}
          >
            <WordDisplay wordLength={wordLength} guess={guess} />

            <ClueBox clue="Some description goes here and it should wrap down nicely if it becomes too long." />

            <GuessInput
              guess={guess}
              setGuess={setGuess}
              wordLength={wordLength}
              placeholderText="Type your guess..."
              guessBtnText="Guess"
            />

            <HintButton btnText="Hint" />
          </div>
        </div>

        <SidePanel />
      </div>
    </div>
  );
}

export default Game;
