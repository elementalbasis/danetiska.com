// dictionary.js
// Simple substring search over raw lexicon.txt.
// - loads ./data/lexicon.txt
// - returns ALL lines containing the query (case-insensitive)
// - supports dictionary.html?q=... (autofill + autorun)

let LINES = [];

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  const v = params.get(name);
  return v ? v.trim() : "";
}

async function loadLexicon() {
  const out = document.getElementById("out");

  try {
    const resp = await fetch("/assets/data/lexicon.txt", { cache: "no-store" });
    if (!resp.ok) {
      throw new Error(`fetch lexicon.txt failed: HTTP ${resp.status} ${resp.statusText}`);
    }

    const text = await resp.text();

    LINES = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith("%"));

    out.textContent = `Loaded ${LINES.length} lines.`;
    return true;
  } catch (err) {
    console.error(err);
    out.textContent = `Failed to load lexicon.txt: ${err}`;
    return false;
  }
}

function runSearch() {
  const qEl = document.getElementById("q");
  const out = document.getElementById("out");

  const q = (qEl.value || "").trim().toLowerCase();
  if (!q) {
    out.textContent = "(enter a search term)";
    return;
  }

  const matches = [];
  for (const line of LINES) {
    if (line.toLowerCase().includes(q)) {
      matches.push(line);
    }
  }

  out.textContent = matches.length ? matches.join("\n") : "(no match)";
}

document.addEventListener("DOMContentLoaded", async () => {
  const ok = await loadLexicon();

  const go = document.getElementById("go");
  const q = document.getElementById("q");

  if (go) go.addEventListener("click", runSearch);
  if (q) {
    q.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runSearch();
    });
  }

  // Autofill + autorun from URL param
  const initial = getQueryParam("q");
  if (ok && q && initial) {
    q.value = initial;
    runSearch();
  }
});

