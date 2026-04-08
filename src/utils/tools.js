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

export { randomIndex, randomIndexExclude, shuffleArray };
