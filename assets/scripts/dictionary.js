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

function getLemmaFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("lemma") || "";
}

function setQueryStateInUrl(query, mode) {
  const url = new URL(window.location.href);

  url.searchParams.delete("lemma");

  if (query && query.trim()) {
    url.searchParams.set("q", query.trim());
    if (mode && mode !== "general") {
      url.searchParams.set("mode", mode);
    } else {
      url.searchParams.delete("mode");
    }
  } else {
    url.searchParams.delete("q");
    url.searchParams.delete("mode");
  }

  history.replaceState({}, "", url);
}

function setLemmaStateInUrl(lemma) {
  const url = new URL(window.location.href);

  url.searchParams.delete("q");
  url.searchParams.delete("mode");

  if (lemma && lemma.trim()) {
    url.searchParams.set("lemma", lemma.trim());
  } else {
    url.searchParams.delete("lemma");
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
  return Array.from(entry.querySelectorAll(".gloss, .silent-gloss"))
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

function noMatchMessageForMode(query, mode) {
  switch (mode) {
    case "lemma-exact":
      return `No exact lemma match for "${query}".`;
    case "lemma-prefix":
      return `No lemma beginning with "${query}".`;
    case "lemma-contains":
      return `No lemma containing "${query}".`;
    case "lemma-suffix":
      return `No lemma ending with "${query}".`;
    case "gloss-exact":
      return `No exact translation match for "${query}".`;
    case "gloss-prefix":
      return `No translation beginning with "${query}".`;
    case "gloss-contains":
      return `No translation containing "${query}".`;
    case "gloss-suffix":
      return `No translation ending with "${query}".`;
    default:
      return `No match for "${query}".`;
  }
}

function positiveMatchMessageForMode(query, mode, count) {
  const n = count === 1 ? "1 match" : `${count} matches`;

  switch (mode) {
    case "lemma-prefix":
      return `${n} for lemmas beginning with "${query}".`;
    case "lemma-contains":
      return `${n} for lemmas containing "${query}".`;
    case "lemma-suffix":
      return `${n} for lemmas ending with "${query}".`;
    case "gloss-exact":
      return `${n} for exact translation "${query}".`;
    case "gloss-prefix":
      return `${n} for translations beginning with "${query}".`;
    case "gloss-contains":
      return `${n} for translations containing "${query}".`;
    case "gloss-suffix":
      return `${n} for translations ending with "${query}".`;
    default:
      return `${n}.`;
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
      message: "",
    };
  }

  const exactGloss = records.filter((record) => record.glosses.includes(q));
  if (exactGloss.length) {
    return {
      kind: "exact",
      matches: exactGloss,
      message: "",
    };
  }

  const suggestions = getSuggestions(records, q);

  if (!suggestions.length) {
    return {
      kind: "none",
      matches: [],
      message: `No match for "${query}".`,
    };
  }

  return {
    kind: "suggest",
    matches: suggestions,
    message: `No exact match for "${query}".`,
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
      message: "",
    };
  }

  if (!query.trim()) {
    return {
      kind: "empty",
      matches: [],
      message: "",
    };
  }

  const matches = records.filter((record) => matchesMode(record, query, mode));

  if (!matches.length) {
    return {
      kind: "none",
      matches: [],
      message: noMatchMessageForMode(query, mode),
    };
  }

  if (mode === "lemma-exact") {
    return {
      kind: "mode",
      matches,
      message: "",
    };
  }

  return {
    kind: "mode",
    matches,
    message: positiveMatchMessageForMode(query, mode, matches.length),
  };
}

function runDirectLemmaLookup(records, lemma) {
  const q = normalize(lemma);

  if (!q) {
    return {
      kind: "empty",
      matches: [],
      message: "",
    };
  }

  const matches = records.filter((record) => record.lemmaHead === q);

  if (!matches.length) {
    return {
      kind: "none",
      matches: [],
      message: `No exact lemma match for "${lemma}".`,
    };
  }

  return {
    kind: "exact",
    matches,
    message: "",
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
  let savedQuery = "";
  let inRandomMode = false;

  try {
    const lexiconHtml = await loadLexicon();
    records = parseEntries(lexiconHtml).map(getSearchRecord);
  } catch (err) {
    out.textContent = "Could not load the dictionary.";
    console.error(err);
    return;
  }

  function renderResult(result) {
    if (wotd) {
      wotd.style.display = result.kind === "empty" ? "" : "none";
    }

    if (result.kind === "empty") {
      out.textContent = "";
      results.innerHTML = "";
      return;
    }

    out.innerHTML = result.message ? escapeHtml(result.message) : "";
    renderEntryList(result.matches, results);
  }

  function applyModeUi(mode) {
    if (mode === "random") {
      if (!inRandomMode) {
        savedQuery = input.value;
      }
      inRandomMode = true;
      input.disabled = true;
      input.value = "Press Search";
      input.placeholder = "Press Search";
    } else {
      if (inRandomMode) {
        input.value = savedQuery;
      }
      inRandomMode = false;
      input.disabled = false;
      input.placeholder = "Search the dictionary";
    }
  }

  function runSearch() {
    const mode = modeSelect.value;

    if (mode === "random") {
      const result = runModeSearch(records, "", "random");
      renderResult(result);

      const picked = result.matches[0];
      if (picked) {
        setLemmaStateInUrl(picked.lemmaHead);
      }

      savedQuery = "";
      input.value = "Press Search";
      return;
    }

    const query = input.value.trim();
    savedQuery = query;

    const result = runModeSearch(records, query, mode);
    setQueryStateInUrl(query, mode);
    renderResult(result);
  }

  modeSelect.addEventListener("change", () => {
    applyModeUi(modeSelect.value);
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

  const initialLemma = getLemmaFromUrl();

  if (initialLemma) {
    savedQuery = "";
    inRandomMode = false;
    applyModeUi(modeSelect.value);

    const result = runDirectLemmaLookup(records, initialLemma);
    renderResult(result);

    if (!input.disabled) {
      input.value = "";
    }
  } else {
    const initialQuery = getQueryFromUrl();
    savedQuery = initialQuery;
    applyModeUi(modeSelect.value);

    if (!input.disabled) {
      input.value = initialQuery;
    }

    if (initialQuery.trim()) {
      const result = runModeSearch(records, initialQuery, initialMode);
      renderResult(result);
    }
  }
});
