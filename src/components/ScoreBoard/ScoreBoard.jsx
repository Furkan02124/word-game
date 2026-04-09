import styles from "./ScoreBoard.module.css";

function ScoreBoard({ score }) {
  return (
    <div className={styles.scoreBoard}>
      <p className={styles.label}>Score</p>
      <p className={styles.value}>{score}</p>
    </div>
  );
}

export default ScoreBoard;
