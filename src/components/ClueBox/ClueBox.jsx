import styles from "./ClueBox.module.css";

function ClueBox({ clue }) {
  return (
    <div className={styles.clueWrapper}>
      <p className={styles.label}>Clue</p>
      <div className={styles.clueBox}>{clue}</div>
    </div>
  );
}

export default ClueBox;
