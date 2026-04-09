import styles from "./HintButton.module.css";

function HintButton({ btnText, onHint, disabled = false }) {
  function handleHint() {
    onHint();
  }

  return (
    <button className={styles.hintBtn} onClick={handleHint} disabled={disabled}>
      {btnText}
    </button>
  );
}

export default HintButton;
