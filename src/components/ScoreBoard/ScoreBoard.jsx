import styles from "./ScoreBoard.module.css";

function ScoreBoard({ score, currentRound, totalWords, roundPoints }) {
  return (
    <div className={styles.scoreBoard}>
      <div className={styles.block}>
        <p className={styles.label}>Round</p>
        <p className={styles.value}>
          {currentRound}/{totalWords}
        </p>
      </div>

      <div className={styles.block}>
        <p className={styles.label}>Word Points</p>
        <p className={styles.value}>{roundPoints}</p>
      </div>

      <div className={styles.block}>
        <p className={styles.label}>Score</p>
        <p className={styles.value}>{score}</p>
      </div>
    </div>
  );
}

export default ScoreBoard;
