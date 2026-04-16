import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Word Game</h1>
        <p className={styles.subtitle}>Guess the word before time runs out</p>
      </div>
    </header>
  );
}

export default Header;
