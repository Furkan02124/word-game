import fs from "fs";
import path from "path";

const INPUT_FILE = path.resolve("tools/20k.txt");
const OUTPUT_FILE = path.resolve("src/data/commonWords.js");

const MIN_LENGTH = 4;
const MAX_LENGTH = 8;
const WORD_LIMIT = 3000;

function isValidWord(word) {
  return (
    /^[a-z]+$/.test(word) &&
    word.length >= MIN_LENGTH &&
    word.length <= MAX_LENGTH
  );
}

const rawText = fs.readFileSync(INPUT_FILE, "utf8");

const words = rawText
  .split(/\r?\n/)
  .map((word) => word.trim().toLowerCase())
  .filter(Boolean)
  .filter(isValidWord)
  .slice(0, WORD_LIMIT);

const fileContent = `const commonWords = ${JSON.stringify(words, null, 2)};

export default commonWords;
`;

fs.writeFileSync(OUTPUT_FILE, fileContent);

console.log(`Generated ${words.length} words -> ${OUTPUT_FILE}`);
