const RANDOM_WORD_API = "https://random-word-api.herokuapp.com/word";
const DATAMUSE_API = "https://api.datamuse.com/words";

function isValidGameWord(word) {
  return /^[a-zA-Z]+$/.test(word) && word.length >= 4 && word.length <= 8;
}

async function fetchRandomWords(count = 12) {
  const collected = new Set();

  while (collected.size < count) {
    const needed = count - collected.size;
    const res = await fetch(`${RANDOM_WORD_API}?number=${needed * 4}&diff=1`);

    if (!res.ok) {
      throw new Error("Failed to fetch random words");
    }

    const data = await res.json();

    data
      .map((w) => w.toUpperCase())
      .filter(isValidGameWord)
      .forEach((word) => collected.add(word));
  }

  return Array.from(collected).slice(0, count);
}

async function fetchClueForWord(word) {
  const res = await fetch(
    `${DATAMUSE_API}?ml=${encodeURIComponent(word)}&max=5`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch clue");
  }

  const data = await res.json();

  const related = data
    .map((item) => item.word)
    .filter(Boolean)
    .slice(0, 3);

  if (!related.length) {
    return `Related to: ${word[0]}...`;
  }

  return `Related to: ${related.join(", ")}`;
}

export async function fetchGameWords(count = 12) {
  const words = await fetchRandomWords(count);

  const results = await Promise.all(
    words.map(async (word) => ({
      answer: word,
      clue: await fetchClueForWord(word),
    }))
  );

  return results;
}
