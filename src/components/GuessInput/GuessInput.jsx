import styles from "./GuessInput.module.css";
function GuessInput({
  guess,
  setGuess,
  wordLength,
  placeholderText,
  guessBtnText,
}) {
  function handleChange(e) {
    const value = e.target.value.toUpperCase().slice(0, wordLength);
    setGuess(value);
  }

  function handleGuess(e) {
    throw Error("Not Implemented", e);
  }

  return (
    <div className={styles.inputRow}>
      <input
        className={styles.guessInput}
        placeholder={placeholderText}
        value={guess}
        type="text"
        onChange={handleChange}
      />
      <button className={styles.guessBtn} onClick={handleGuess}>
        {guessBtnText}
      </button>
    </div>
  );
}

export default GuessInput;
