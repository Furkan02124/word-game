import Tile from "./Tile";
import styles from "./WordDisplay.module.css";
function WordDisplay({ wordLength, guess }) {
  return (
    <div
      className={styles.row}
      style={{
        gridTemplateColumns: `repeat(${wordLength}, 60px)`,
      }}
    >
      {[...Array(wordLength)].map((_, i) => (
        <Tile key={i} letter={guess[i] || ""} />
      ))}
    </div>
  );
}
export default WordDisplay;
