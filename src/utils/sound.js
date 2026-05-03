import correctSoundSrc from "@/assets/sounds/correct.mp3";
import wrongSoundSrc from "@/assets/sounds/wrong.mp3";
import winSoundSrc from "@/assets/sounds/win.mp3";

const correctSound = new Audio(correctSoundSrc);
const wrongSound = new Audio(wrongSoundSrc);
const winSound = new Audio(winSoundSrc);

correctSound.volume = 0.4;
wrongSound.volume = 0.4;
winSound.volume = 0.5;

let muted = false;

export function setMuted(value) {
  muted = value;
}

function playSound(sound, { varyPitch = false } = {}) {
  if (muted) return;

  sound.currentTime = 0;

  if (varyPitch) {
    sound.playbackRate = 1 + Math.random() * 0.05;
  }

  sound.play().catch(() => {});
}

export function playCorrect() {
  playSound(correctSound, { varyPitch: true });
}

export function playWrong() {
  playSound(wrongSound, { varyPitch: true });
}

export function playWin() {
  playSound(winSound);
}
