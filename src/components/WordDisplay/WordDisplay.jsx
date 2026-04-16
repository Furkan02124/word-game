import Tile from "./Tile";
import styles from "./WordDisplay.module.css";

function WordDisplay({ letters, isCorrect, isWrong }) {
  return (
    <div
      className={styles.row}
      style={{ gridTemplateColumns: `repeat(${letters.length}, 60px)` }}
    >
      {letters.map((letter, i) => (
        <Tile
          key={i}
          letter={letter}
          isCorrect={isCorrect}
          isWrong={isWrong}
          index={i}
        />
      ))}
    </div>
  );
}

export default WordDisplay;
