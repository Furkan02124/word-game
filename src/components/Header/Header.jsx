import styles from "./Header.module.css";

function Header({ isMuted, onToggleMute }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>Word Game</h1>
          <button
            className={styles.muteBtn}
            onClick={onToggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            <span className="material-symbols-outlined">
              {isMuted ? "volume_off" : "volume_up"}
            </span>
          </button>
        </div>
        <p className={styles.subtitle}>Guess the word before time runs out</p>
      </div>
    </header>
  );
}

export default Header;
