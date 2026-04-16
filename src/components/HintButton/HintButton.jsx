import styles from "./HintButton.module.css";

function HintButton({ btnText, onHint, disabled = false }) {
  function handleHint() {
    if (disabled) return;
    onHint();
  }

  return (
    <button className={styles.hintBtn} onClick={handleHint} disabled={disabled}>
      {btnText}
    </button>
  );
}

export default HintButton;
