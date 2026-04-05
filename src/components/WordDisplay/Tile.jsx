import styles from "./Tile.module.css";
function Tile({ letter }) {
  const isFilled = letter !== "";
  return (
    <div className={`${styles.tile} ${isFilled ? styles.filled : ""}`}>
      {letter}
    </div>
  );
}
export default Tile;
