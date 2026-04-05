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

function escapeHtml(text) {
  return (text || "").replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return ch;
    }
  });
}

function getQueryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("q") || "";
}

function getModeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("mode") || "general";
}

function setSearchStateInUrl(query, mode) {
  const url = new URL(window.location.href);

  if (query && query.trim()) {
    url.searchParams.set("q", query.trim());
  } else {
    url.searchParams.delete("q");
  }

  if (mode && mode !== "general") {
    url.searchParams.set("mode", mode);
  } else {
    url.searchParams.delete("mode");
  }

  history.replaceState({}, "", url);
}

function parseEntries(htmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, "text/html");
  return Array.from(doc.querySelectorAll(".entry"));
}

function getLemmaText(entry) {
  return entry.querySelector(".lemma")?.textContent || "";
}

function getLemmaHead(entry) {
  const raw = getLemmaText(entry);
  return normalize(raw.split(/[;,]/)[0]);
}

function getGlosses(entry) {
  return Array.from(entry.querySelectorAll(".gloss"))
    .map((el) => normalize(el.textContent))
    .filter(Boolean);
}

function getSearchRecord(entry) {
  return {
    entry,
    lemmaText: getLemmaText(entry),
    lemmaHead: getLemmaHead(entry),
    glosses: getGlosses(entry),
  };
}

function matchesMode(record, query, mode) {
  const q = normalize(query);
  if (!q) return true;

  const lemma = record.lemmaHead;
  const glosses = record.glosses;

  switch (mode) {
    case "lemma-exact":
      return lemma === q;

    case "lemma-prefix":
      return lemma.startsWith(q);

    case "lemma-contains":
      return lemma.includes(q);

    case "lemma-suffix":
      return lemma.endsWith(q);

    case "gloss-exact":
      return glosses.includes(q);

    case "gloss-prefix":
      return glosses.some((g) => g.startsWith(q));

    case "gloss-contains":
      return glosses.some((g) => g.includes(q));

    case "gloss-suffix":
      return glosses.some((g) => g.endsWith(q));

    default:
      return false;
  }
}

function getSuggestions(records, query) {
  const q = normalize(query);
  if (!q) return [];

  const exactLemma = [];
  const exactGloss = [];
  const lemmaPrefix = [];
  const lemmaContains = [];
  const glossPrefix = [];
  const glossContains = [];

  for (const record of records) {
    const lemma = record.lemmaHead;
    const glosses = record.glosses;

    if (lemma === q) {
      exactLemma.push(record);
      continue;
    }

    if (glosses.includes(q)) {
      exactGloss.push(record);
      continue;
    }

    if (lemma.startsWith(q)) {
      lemmaPrefix.push(record);
      continue;
    }

    if (lemma.includes(q)) {
      lemmaContains.push(record);
      continue;
    }

    if (glosses.some((g) => g.startsWith(q))) {
      glossPrefix.push(record);
      continue;
    }

    if (glosses.some((g) => g.includes(q))) {
      glossContains.push(record);
    }
  }

  const seen = new Set();
  const merged = [
    ...exactLemma,
    ...exactGloss,
    ...lemmaPrefix,
    ...lemmaContains,
    ...glossPrefix,
    ...glossContains,
  ].filter((record) => {
    const key = record.lemmaText;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return merged.slice(0, 12);
}

function renderEntryList(records, resultsEl) {
  resultsEl.innerHTML = "";
  for (const record of records) {
    resultsEl.appendChild(record.entry.cloneNode(true));
  }
}

function setModeUi(mode, input) {
  if (mode === "random") {
    input.value = "";
    input.disabled = true;
    input.placeholder = "Press search";
  } else {
    input.disabled = false;
    input.placeholder = "Search the dictionary";
  }
}

function runGeneralSearch(records, query) {
  const q = normalize(query);

  if (!q) {
    return {
      kind: "empty",
      matches: [],
      message: "",
    };
  }

  const exactLemma = records.filter((record) => record.lemmaHead === q);
  if (exactLemma.length) {
    return {
      kind: "exact",
      matches: exactLemma,
      message:
        exactLemma.length === 1
          ? `1 exact lemma match for "${query}".`
          : `${exactLemma.length} exact lemma matches for "${query}".`,
    };
  }

  const exactGloss = records.filter((record) => record.glosses.includes(q));
  if (exactGloss.length) {
    return {
      kind: "exact",
      matches: exactGloss,
      message:
        exactGloss.length === 1
          ? `1 exact gloss match for "${query}".`
          : `${exactGloss.length} exact gloss matches for "${query}".`,
    };
  }

  const suggestions = getSuggestions(records, q);

  if (!suggestions.length) {
    return {
      kind: "none",
      matches: [],
      message: `No match for “${query}”.`,
    };
  }

  return {
    kind: "suggest",
    matches: suggestions,
    message:
      `No match for “${query}”. ` +
      `Maybe these are what you're looking for?`,
  };
}

function runModeSearch(records, query, mode) {
  if (mode === "general") {
    return runGeneralSearch(records, query);
  }

  if (mode === "random") {
    const randomRecord = records[Math.floor(Math.random() * records.length)];
    return {
      kind: "random",
      matches: randomRecord ? [randomRecord] : [],
      message: "Random entry.",
    };
  }

  const matches = records.filter((record) => matchesMode(record, query, mode));

  let label = mode;
  switch (mode) {
    case "lemma-exact": label = "lemma exact"; break;
    case "lemma-prefix": label = "lemma begins with"; break;
    case "lemma-contains": label = "lemma contains"; break;
    case "lemma-suffix": label = "lemma ends with"; break;
    case "gloss-exact": label = "gloss exact"; break;
    case "gloss-prefix": label = "gloss begins with"; break;
    case "gloss-contains": label = "gloss contains"; break;
    case "gloss-suffix": label = "gloss ends with"; break;
  }

  if (!query.trim() && mode !== "random") {
    return {
      kind: "empty",
      matches: [],
      message: "",
    };
  }

  if (!matches.length) {
    return {
      kind: "none",
      matches: [],
      message: `No ${label} matches for "${query}".`,
    };
  }

  return {
    kind: "mode",
    matches,
    message:
      matches.length === 1
        ? `1 ${label} match for "${query}".`
        : `${matches.length} ${label} matches for "${query}".`,
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector(".search");
  const input = form?.querySelector('input[name="q"]');
  const modeSelect = form?.querySelector('select[name="mode"]');
  const out = document.getElementById("out");
  const results = document.getElementById("results");
  const wotd = document.querySelector(".word-card");

  if (!form || !input || !modeSelect || !out || !results) return;

  let records = [];

  try {
    const lexiconHtml = await loadLexicon();
    records = parseEntries(lexiconHtml).map(getSearchRecord);
  } catch (err) {
    out.textContent = "Could not load the dictionary.";
    console.error(err);
    return;
  }

  function runSearch() {
    const mode = modeSelect.value;
    const query = mode === "random" ? "" : input.value.trim();

    setModeUi(mode, input);
    setSearchStateInUrl(query, mode);

    const result = runModeSearch(records, query, mode);

    if (wotd) {
      wotd.style.display = result.kind === "empty" ? "" : "none";
    }

    if (result.kind === "empty") {
      out.textContent = "";
      results.innerHTML = "";
      return;
    }

    out.innerHTML = escapeHtml(result.message);
    renderEntryList(result.matches, results);
  }

  modeSelect.addEventListener("change", () => {
    setModeUi(modeSelect.value, input);
    runSearch();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSearch();
  });

  const initialMode = getModeFromUrl();
  if ([...modeSelect.options].some((opt) => opt.value === initialMode)) {
    modeSelect.value = initialMode;
  } else {
    modeSelect.value = "general";
  }

  const initialQuery = getQueryFromUrl();
  if (modeSelect.value !== "random") {
    input.value = initialQuery;
  }

  setModeUi(modeSelect.value, input);
  runSearch();
});
