function randomIndex(max) {
  return Math.floor(Math.random() * max);
}

function randomIndexExclude(max, exclude) {
  let index;
  do {
    index = Math.floor(Math.random() * max);
  } while (index === exclude);
  return index;
}

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getDisplayLetters(answer, guess, revealedIndexes) {
  const displayLetters = [];
  let typedIndex = 0;

  for (let i = 0; i < answer.length; i += 1) {
    if (revealedIndexes.includes(i)) {
      displayLetters.push(answer[i]);
    } else {
      displayLetters.push(guess[typedIndex] || "");
      typedIndex += 1;
    }
  }

  return displayLetters;
}

function getMergedGuess(answer, guess, revealedIndexes) {
  return getDisplayLetters(answer, guess, revealedIndexes).join("");
}

export {
  randomIndex,
  randomIndexExclude,
  shuffleArray,
  getDisplayLetters,
  getMergedGuess,
};
