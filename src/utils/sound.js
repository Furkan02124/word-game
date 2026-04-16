const correctSound = new Audio("/src/assets/sounds/correct.mp3");
const wrongSound = new Audio("/src/assets/sounds/wrong.mp3");
const winSound = new Audio("/src/assets/sounds/win.mp3");

correctSound.volume = 0.4;
wrongSound.volume = 0.4;

export function playCorrect() {
  correctSound.currentTime = 0;
  correctSound.playbackRate = 1 + Math.random() * 0.05;
  correctSound.play();
}

export function playWrong() {
  wrongSound.currentTime = 0;
  wrongSound.playbackRate = 1 + Math.random() * 0.05;
  wrongSound.play();
}

export function playWin() {
  winSound.currentTime = 0;
  winSound.playbackRate = 1 + Math.random() * 0.05;
  winSound.play();
}
