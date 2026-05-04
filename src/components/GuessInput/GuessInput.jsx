import { useEffect, useRef } from "react";
import styles from "./GuessInput.module.css";

function GuessInput({
  guess,
  mergedGuess,
  setGuess,
  placeholderText,
  guessBtnText,
  onSubmitGuess,
  setMessage,
  availableSlots,
  disabled = false,
  focusTrigger,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [focusTrigger, disabled]);

  function handleKeyDown(e) {
    if (disabled) return;

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

      if (guess.length >= availableSlots) return;

      setGuess((prev) => prev + e.key.toUpperCase());
      setMessage("");
    }
  }

  function handleGuess() {
    onSubmitGuess();
  }

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();

    if (/^[A-Z]*$/.test(value)) {
      setGuess(value);
    }
  };
  return (
    <div className={styles.inputRow}>
      <input
        ref={inputRef}
        className={styles.guessInput}
        placeholder={placeholderText}
        value={mergedGuess}
        type="text"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        className={styles.guessBtn}
        onClick={handleGuess}
        disabled={disabled}
      >
        {guessBtnText}
      </button>
    </div>
  );
}

export default GuessInput;
