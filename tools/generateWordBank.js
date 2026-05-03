import fs from "fs";
import path from "path";
import natural from "natural";

const wordnet = new natural.WordNet();

const INPUT_FILE = path.resolve("src/data/commonWords.js");
const OUTPUT_FILE = path.resolve("src/data/wordBank.js");

const MAX_WORDS = 2000;

function loadCommonWords() {
  const file = fs.readFileSync(INPUT_FILE, "utf8");

  const match = file.match(/\[([\s\S]*)\]/);
  if (!match) return [];

  const words = JSON.parse(`[${match[1]}]`);
  return words.slice(0, MAX_WORDS);
}

function getDefinitions(word) {
  return new Promise((resolve) => {
    wordnet.lookup(word, (results) => {
      if (!results || results.length === 0) {
        resolve([]);
        return;
      }

      const nouns = results.filter((r) => r.pos === "n");
      const preferredResults = nouns.length ? nouns : results;

      const definitions = preferredResults
        .map((result) => result.gloss)
        .filter(Boolean);

      resolve(definitions);
    });
  });
}

function cleanDefinition(definition, word) {
  if (!definition) return null;

  let cleaned = definition.split(";")[0];

  const regex = new RegExp(word, "ig");
  cleaned = cleaned.replace(regex, "_".repeat(word.length));

  cleaned = cleaned.trim();

  if (cleaned.length < 20) return null;

  if (cleaned.length > 100) return null;

  if (/[^a-zA-Z0-9\s,.-]/.test(cleaned)) return null;

  return cleaned;
}

async function buildWordBank() {
  const words = loadCommonWords();
  const result = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    const definitions = await getDefinitions(word);

    const clues = definitions
      .map((definition) => cleanDefinition(definition, word))
      .filter(Boolean)
      .slice(0, 3);

    if (clues.length < 1) continue;

    result.push({
      answer: word.toUpperCase(),
      clues,
      length: word.length,
      difficulty: getDifficulty(i, word, clues.length),
    });

    console.log(`✔ ${word}`);
  }

  return result;
}

function saveWordBank(data) {
  const content = `const wordBank = ${JSON.stringify(data, null, 2)};

export default wordBank;
`;

  fs.writeFileSync(OUTPUT_FILE, content);
}

function getDifficulty(index, word, clueCount) {
  let score = 0;

  if (index < 1000) score += 0;
  else if (index < 3000) score += 1;
  else score += 2;

  if (word.length <= 5) score += 0;
  else if (word.length <= 6) score += 1;
  else score += 2;

  if (clueCount <= 1) score += 1;

  if (/[qxzj]/.test(word)) score += 1;

  if (score <= 1) return "easy";
  if (score <= 3) return "medium";
  return "hard";
}

async function run() {
  console.log("Generating word bank...");

  const data = await buildWordBank();

  saveWordBank(data);

  console.log(`Done. Generated ${data.length} words.`);
}

run();
