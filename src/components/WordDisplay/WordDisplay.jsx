import Tile from "./Tile";
import styles from "./WordDisplay.module.css";

function WordDisplay({ letters }) {
  return (
    <div
      className={styles.row}
      style={{ gridTemplateColumns: `repeat(${letters.length}, 60px)` }}
    >
      {letters.map((letter, i) => (
        <Tile key={i} letter={letter} />
      ))}
    </div>
  );
}

export default WordDisplay;
