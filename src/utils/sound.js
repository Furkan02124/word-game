import correctSrc from "@/assets/sounds/correct.mp3";
import wrongSrc from "@/assets/sounds/wrong.mp3";
import winSrc from "@/assets/sounds/win.mp3";

const correctSound = new Audio(correctSrc);
const wrongSound = new Audio(wrongSrc);
const winSound = new Audio(winSrc);

correctSound.volume = 0.4;
wrongSound.volume = 0.4;
winSound.volume = 0.4;

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
