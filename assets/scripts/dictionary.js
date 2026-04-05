async function loadLexicon() {
  const response = await fetch("/assets/lexicon/lexicon.html", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load lexicon: ${response.status}`);
  }
  return await response.text();
}

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getQueryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("q") || "";
}

function setQueryInUrl(query) {
  const url = new URL(window.location.href);

  if (query && query.trim()) {
    url.searchParams.set("q", query.trim());
  } else {
    url.searchParams.delete("q");
  }

  history.replaceState({}, "", url);
}

function parseEntries(htmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, "text/html");
  return Array.from(doc.querySelectorAll(".entry"));
}

function getLemma(entry) {
  return normalize(entry.querySelector(".lemma")?.textContent || "");
}

function getGlosses(entry) {
  return Array.from(entry.querySelectorAll(".gloss"))
    .map(el => normalize(el.textContent))
    .filter(Boolean);
}

function entryMatches(entry, query) {
  const q = normalize(query);
  if (!q) return true;

  const lemma = getLemma(entry);
  const glosses = getGlosses(entry);

  return lemma.includes(q) || glosses.some(g => g.includes(q));
}

function renderMatches(entries, query, resultsEl, outEl) {
  resultsEl.innerHTML = "";

  const matches = entries.filter(entry => entryMatches(entry, query));

  for (const entry of matches) {
    resultsEl.appendChild(entry.cloneNode(true));
  }

  if (!query.trim()) {
    outEl.textContent = `Showing all ${matches.length} entries.`;
  } else if (matches.length === 0) {
    outEl.textContent = `No matches for "${query}".`;
  } else if (matches.length === 1) {
    outEl.textContent = `1 match for "${query}".`;
  } else {
    outEl.textContent = `${matches.length} matches for "${query}".`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector(".search");
  const input = form?.querySelector('input[name="q"]');
  const out = document.getElementById("out");
  const results = document.getElementById("results");

  if (!form || !input || !out || !results) return;

  let entries = [];

  try {
    const lexiconHtml = await loadLexicon();
    entries = parseEntries(lexiconHtml);
  } catch (err) {
    out.textContent = "Could not load the dictionary.";
    console.error(err);
    return;
  }

  function runSearch(query) {
    const q = (query ?? input.value ?? "").trim();
    input.value = q;
    setQueryInUrl(q);
    renderMatches(entries, q, results, out);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch(input.value);
  });

  const initialQuery = getQueryFromUrl();
  runSearch(initialQuery);
});
