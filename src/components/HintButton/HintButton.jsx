import styles from "./HintButton.module.css";

function HintButton({ btnText, onHint }) {
  function handleHint() {
    onHint();
  }

  return (
    <button className={styles.hintBtn} onClick={handleHint}>
      {btnText}
    </button>
  );
}

export default HintButton;
