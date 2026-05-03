import correctSrc from "@/assets/sounds/correct.mp3";
import wrongSrc from "@/assets/sounds/wrong.mp3";
import winSrc from "@/assets/sounds/win.mp3";

const correctSound = new Audio(correctSrc);
const wrongSound = new Audio(wrongSrc);
const winSound = new Audio(winSrc);

let muted = false;
correctSound.volume = 0.4;
wrongSound.volume = 0.4;
winSound.volume = 0.4;

export function toggleMute(value) {
  muted = value;
}

export function play(sound) {
  if (muted) return;
  sound.currentTime = 0;
  sound.playbackRate = 1 + Math.random() * 0.05;
  sound.play();
}

export function playCorrect() {
  play(correctSound);
}

export function playWrong() {
  play(wrongSound);
}

export function playWin() {
  play(winSound);
}
