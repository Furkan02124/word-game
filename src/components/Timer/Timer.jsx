import styles from "./Timer.module.css";

function Timer({ timeLeft }) {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const isLow = timeLeft <= 10;

  return (
    <div className={`${styles.timer} ${isLow ? styles.low : ""}`}>
      <p className={styles.label}>Time</p>
      <p className={styles.value}>
        {minutes}:{seconds}
      </p>
    </div>
  );
}

export default Timer;
