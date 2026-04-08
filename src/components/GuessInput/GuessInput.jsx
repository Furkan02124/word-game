import styles from "./GuessInput.module.css";
import { useRef, useEffect } from "react";

function GuessInput({
  guess,
  mergedGuess,
  setGuess,
  placeholderText,
  guessBtnText,
  onSubmitGuess,
  setMessage,
  availableSlots,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [mergedGuess]);

  function handleKeyDown(e) {
    if (e.key === "Backspace") {
      e.preventDefault();
      setGuess((prev) => prev.slice(0, -1));
      setMessage("");
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      onSubmitGuess();
      return;
    }

    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();

      if (guess.length >= availableSlots) {
        return;
      }

      setGuess((prev) => prev + e.key.toUpperCase());
      setMessage("");
    }
  }

  function handleGuess() {
    onSubmitGuess();
  }

  return (
    <div className={styles.inputRow}>
      <input
        ref={inputRef}
        className={styles.guessInput}
        placeholder={placeholderText}
        value={mergedGuess}
        type="text"
        readOnly
        onKeyDown={handleKeyDown}
      />
      <button className={styles.guessBtn} onClick={handleGuess}>
        {guessBtnText}
      </button>
    </div>
  );
}

export default GuessInput;
