import styles from "./HintButton.module.css";

function HintButton({ btnText }) {
  function handleHint(e) {
    throw Error("Not Implemented", e);
  }

  return (
    <button className={styles.hintBtn} onClick={handleHint}>
      {btnText}
    </button>
  );
}

export default HintButton;
