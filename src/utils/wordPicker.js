import wordBank from "@/data/wordBank";
import { randomIndex, shuffleArray } from "./tools";

const EASY_COUNT = 4;
const MEDIUM_COUNT = 4;
const HARD_COUNT = 4;

function pickRandomClue(clues) {
  if (!clues?.length) return "No clue available.";
  return clues[randomIndex(clues.length)];
}

function prepareWord(word) {
  return {
    answer: word.answer,
    clue: pickRandomClue(word.clues),
    length: word.length,
    difficulty: word.difficulty,
  };
}

export function buildDifficultyGameWords() {
  const easy = shuffleArray(
    wordBank.filter((word) => word.difficulty === "easy")
  )
    .slice(0, EASY_COUNT)
    .map(prepareWord);

  const medium = shuffleArray(
    wordBank.filter((word) => word.difficulty === "medium")
  )
    .slice(0, MEDIUM_COUNT)
    .map(prepareWord);

  const hard = shuffleArray(
    wordBank.filter((word) => word.difficulty === "hard")
  )
    .slice(0, HARD_COUNT)
    .map(prepareWord);

  return [...easy, ...medium, ...hard];
}
