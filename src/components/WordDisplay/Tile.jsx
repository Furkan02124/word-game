import styles from "./Tile.module.css";
function Tile({ letter, isCorrect, isWrong, index }) {
  const isFilled = letter !== "";

  const className = `${styles.tile} ${isFilled ? styles.filled : ""} ${isCorrect ? styles.correct : ""} ${isWrong ? styles.wrong : ""}`;
  return (
    <div
      className={className}
      style={
        isCorrect
          ? { animationDelay: `${index * 60}ms` }
          : isWrong
            ? { animationDelay: `${index * 40}ms` }
            : undefined
      }
    >
      {letter}
    </div>
  );
}
export default Tile;
