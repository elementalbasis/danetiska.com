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
  window.history.replaceState({}, "", url);
}

function parseEntries(htmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, "text/html");
  return Array.from(doc.querySelectorAll(".entry"));
}

function entryMatches(entry, query) {
  const q = normalize(query);
  if (!q) return true;

  const lemma = normalize(entry.querySelector(".lemma")?.textContent || "");
  const glosses = normalize(
    Array.from(entry.querySelectorAll(".gloss"))
      .map(el => el.textContent)
      .join(" ")
  );

  return lemma.includes(q) || glosses.includes(q);
}

function updateStatus(out, count, query) {
  if (!query.trim()) {
    out.textContent = `Showing all ${count} entries.`;
    return;
  }

  if (count === 0) {
    out.textContent = `No matches for "${query}".`;
    return;
  }

  if (count === 1) {
    out.textContent = `1 match for "${query}".`;
    return;
  }

  out.textContent = `${count} matches for "${query}".`;
}

function renderMatches(entries, query, resultsEl, outEl) {
  resultsEl.innerHTML = "";

  const matches = entries.filter(entry => entryMatches(entry, query));

  for (const entry of matches) {
    resultsEl.appendChild(entry.cloneNode(true));
  }

  updateStatus(outEl, matches.length, query);
}

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("q");
  const button = document.getElementById("go");
  const out = document.getElementById("out");
  const results = document.getElementById("results");

  if (!input || !button || !out || !results) return;

  let entries = [];

  try {
    const lexiconHtml = await loadLexicon();
    entries = parseEntries(lexiconHtml);
  } catch (err) {
    out.textContent = "Could not load the dictionary.";
    console.error(err);
    return;
  }

  function runSearch() {
    const query = input.value || "";
    setQueryInUrl(query);
    renderMatches(entries, query, results, out);
  }

  button.addEventListener("click", runSearch);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runSearch();
    }
  });

  input.addEventListener("input", runSearch);

  const initialQuery = getQueryFromUrl();
  if (initialQuery) {
    input.value = initialQuery;
  }

  renderMatches(entries, input.value || "", results, out);
});
