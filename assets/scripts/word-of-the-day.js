async function loadWordOfTheDay() {
  const linkEl = document.getElementById("word-of-the-day-link");
  if (!linkEl) return;

  try {
    const response = await fetch("/assets/lexicon/word_of_the_day_3352.tsv", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load TSV: ${response.status}`);
    }

    const text = await response.text();
    const rows = text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line && !line.startsWith("%"));

    const table = new Map();

    for (const row of rows) {
      const parts = row.split("\t");
      if (parts.length < 2) continue;

      const isoDate = parts[0].trim();
      const lemma = parts[1].trim();

      if (isoDate && lemma) {
        table.set(isoDate, lemma);
      }
    }

    const today = new Date();

    const isoToday =
      today.getFullYear() + "-" +
      String(today.getMonth() + 1).padStart(2, "0") + "-" +
      String(today.getDate()).padStart(2, "0");

    const lemma = table.get(isoToday);

    if (!lemma) {
      linkEl.textContent = "Unavailable";
      linkEl.removeAttribute("href");
      return;
    }

    linkEl.textContent = lemma;
    linkEl.href = `/dictionary?q=${encodeURIComponent(lemma)}&mode=lemma-exact`;
  } catch (err) {
    console.error(err);
    linkEl.textContent = "Unavailable";
    linkEl.removeAttribute("href");
  }
}

document.addEventListener("DOMContentLoaded", loadWordOfTheDay);
