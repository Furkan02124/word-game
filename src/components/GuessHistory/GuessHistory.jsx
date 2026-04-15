import styles from "./GuessHistory.module.css";

function GuessHistory({ guesses }) {
  if (!guesses.length) return null;

  return (
    <div className={styles.history}>
      <h3 className={styles.title}>Previous Guesses</h3>

      <div className={styles.list}>
        {guesses.map((guess, index) => (
          <span key={`${guess}-${index}`} className={styles.item}>
            {guess}
          </span>
        ))}
      </div>
    </div>
  );
}

export default GuessHistory;
