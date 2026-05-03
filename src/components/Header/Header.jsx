import styles from "./Header.module.css";

function Header({ isMuted, onToggleMute }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Word Game</h1>
        <p className={styles.subtitle}>Guess the word before time runs out</p>
        <button
          className={styles.muteBtn}
          onClick={onToggleMute}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
    </header>
  );
}

export default Header;
