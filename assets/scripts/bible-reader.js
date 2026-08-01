(() => {
  "use strict";

  const reader = document.getElementById("bible-reader");

  if (!reader) {
    return;
  }

  const sources = {
    danetian: {
      name: "Danetian",
      file: "/bible/danetian.tsv"
    },
    english: {
      name: "English",
      file: "/bible/english.tsv"
    },
    greek: {
      name: "Greek",
      file: "/bible/greek.tsv"
    },
    latin: {
      name: "Latin",
      file: "/bible/latin.tsv"
    },
    slavonic: {
      name: "Slavonic",
      file: "/bible/slavonic.tsv"
    }
  };

  const bookSelect = document.getElementById("bible-book");
  const chapterSelect = document.getElementById("bible-chapter");
  const previousButton = document.getElementById("bible-prev");
  const nextButton = document.getElementById("bible-next");
  const languageControls = document.getElementById("bible-languages");
  const status = document.getElementById("bible-status");
  const content = document.getElementById("bible-content");
  const heading = document.getElementById("bible-heading");
  const versesContainer = document.getElementById("bible-verses");

  const loadedSources = {};
  const books = new Map();

  let currentBook = "";
  let currentChapter = 1;

  function parseTsv(rawText) {
    const rows = [];

    for (const rawLine of rawText.split(/\r?\n/)) {
      if (!rawLine.trim()) {
        continue;
      }

      const fields = rawLine.split("\t");

      if (fields.length < 5) {
        console.warn("Skipping malformed Bible line:", rawLine);
        continue;
      }

      const [
        bookName,
        abbreviation,
        chapter,
        verse,
        ...textParts
      ] = fields;

      const chapterNumber = Number(chapter);

      if (!bookName || !abbreviation || !Number.isFinite(chapterNumber)) {
        console.warn("Skipping invalid Bible line:", rawLine);
        continue;
      }

      rows.push({
        book: bookName.trim(),
        abbreviation: abbreviation.trim(),
        chapter: chapterNumber,
        verse: verse.trim(),
        text: textParts.join("\t").trim()
      });
    }

    return rows;
  }

  function referenceKey(row) {
    return [
      row.abbreviation,
      row.chapter,
      row.verse
    ].join(".");
  }

  function chapterKey(abbreviation, chapter) {
    return `${abbreviation}.${chapter}`;
  }

  function indexRows(rows) {
    const verses = new Map();
    const chapters = new Map();

    for (const row of rows) {
      const key = referenceKey(row);
      const currentChapterKey = chapterKey(
        row.abbreviation,
        row.chapter
      );

      if (!verses.has(key)) {
        verses.set(key, []);
      }

      verses.get(key).push(row.text);

      if (!chapters.has(currentChapterKey)) {
        chapters.set(currentChapterKey, []);
      }

      chapters.get(currentChapterKey).push(row);
    }

    return {
      rows,
      verses,
      chapters
    };
  }

  async function loadSource(id, source) {
    const response = await fetch(source.file);

    if (!response.ok) {
      throw new Error(
        `Could not load ${source.file}: ${response.status}`
      );
    }

    const rawText = await response.text();
    const rows = parseTsv(rawText);

    loadedSources[id] = {
      ...source,
      ...indexRows(rows)
    };

    for (const row of rows) {
      if (!books.has(row.abbreviation)) {
        books.set(row.abbreviation, {
          name: row.book,
          abbreviation: row.abbreviation,
          chapters: new Set()
        });
      }

      books.get(row.abbreviation).chapters.add(row.chapter);
    }
  }

  async function loadAllSources() {
    const results = await Promise.allSettled(
      Object.entries(sources).map(([id, source]) =>
        loadSource(id, source)
      )
    );

    const failed = results.filter(
      result => result.status === "rejected"
    );

    for (const failure of failed) {
      console.error(failure.reason);
    }

    if (Object.keys(loadedSources).length === 0) {
      throw new Error("No Bible texts could be loaded.");
    }
  }

  function getSelectedTexts() {
    return Array.from(
      languageControls.querySelectorAll(
        "button[aria-pressed='true']"
      )
    ).map(button => button.dataset.text);
  }

  function restoreSelectedTexts() {
    const stored = localStorage.getItem("bible-reader-texts");

    if (!stored) {
      return;
    }

    let selected;

    try {
      selected = JSON.parse(stored);
    } catch {
      return;
    }

    if (!Array.isArray(selected) || selected.length === 0) {
      return;
    }

    for (const button of languageControls.querySelectorAll("button")) {
      const active = selected.includes(button.dataset.text);

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    }
  }

  function saveSelectedTexts() {
    localStorage.setItem(
      "bible-reader-texts",
      JSON.stringify(getSelectedTexts())
    );
  }

  function getOrderedBooks() {
    return Array.from(books.values());
  }

  function populateBooks() {
    bookSelect.replaceChildren();

    for (const book of getOrderedBooks()) {
      const option = document.createElement("option");

      option.value = book.abbreviation;
      option.textContent = book.name;

      bookSelect.append(option);
    }
  }

  function populateChapters() {
    chapterSelect.replaceChildren();

    const book = books.get(currentBook);

    if (!book) {
      return;
    }

    const chapters = Array.from(book.chapters)
      .sort((a, b) => a - b);

    for (const chapter of chapters) {
      const option = document.createElement("option");

      option.value = String(chapter);
      option.textContent = String(chapter);

      chapterSelect.append(option);
    }

    if (!chapters.includes(currentChapter)) {
      currentChapter = chapters[0];
    }

    chapterSelect.value = String(currentChapter);
  }

  function parseVerseNumber(value) {
    const match = String(value).match(/^(\d+)(.*)$/);

    if (!match) {
      return {
        number: Number.POSITIVE_INFINITY,
        suffix: String(value)
      };
    }

    return {
      number: Number(match[1]),
      suffix: match[2]
    };
  }

  function compareVerses(a, b) {
    const first = parseVerseNumber(a.verse);
    const second = parseVerseNumber(b.verse);

    if (first.number !== second.number) {
      return first.number - second.number;
    }

    return first.suffix.localeCompare(second.suffix);
  }

  function collectChapterReferences() {
    const references = new Map();

    for (const source of Object.values(loadedSources)) {
      const rows = source.chapters.get(
        chapterKey(currentBook, currentChapter)
      );

      if (!rows) {
        continue;
      }

      for (const row of rows) {
        const key = referenceKey(row);

        if (!references.has(key)) {
          references.set(key, {
            key,
            verse: row.verse
          });
        }
      }
    }

    return Array.from(references.values()).sort(compareVerses);
  }

  function getText(sourceId, reference) {
    const source = loadedSources[sourceId];

    if (!source) {
      return [];
    }

    return source.verses.get(reference) || [];
  }

  function createTextBlock(sourceId, reference) {
    const source = loadedSources[sourceId];

    if (!source) {
      return null;
    }

    const texts = getText(sourceId, reference);

    if (texts.length === 0) {
      return null;
    }

    const block = document.createElement("div");
    block.className = `bible-text bible-text-${sourceId}`;

    const label = document.createElement("div");
    label.className = "bible-text-label";
    label.textContent = source.name;

    const paragraph = document.createElement("p");
    paragraph.textContent = texts.join(" ");

    block.append(label, paragraph);

    return block;
  }

  function renderChapter() {
    const book = books.get(currentBook);

    if (!book) {
      return;
    }

    const selectedTexts = getSelectedTexts();
    const references = collectChapterReferences();

    heading.textContent = `${book.name} ${currentChapter}`;
    versesContainer.replaceChildren();

    for (const reference of references) {
      const verse = document.createElement("section");
      verse.className = "bible-verse";

      const number = document.createElement("div");
      number.className = "bible-verse-number";
      number.textContent = reference.verse;

      const parallelTexts = document.createElement("div");
      parallelTexts.className = "bible-parallel-texts";

      for (const sourceId of selectedTexts) {
        const block = createTextBlock(sourceId, reference.key);

        if (block) {
          parallelTexts.append(block);
        }
      }

      if (!parallelTexts.children.length) {
        continue;
      }

      verse.append(number, parallelTexts);
      versesContainer.append(verse);
    }

    if (!versesContainer.children.length) {
      const message = document.createElement("p");
      message.className = "bible-empty";
      message.textContent =
        "No selected text is available for this chapter.";

      versesContainer.append(message);
    }

    updateNavigationButtons();
    updateUrl();

    status.hidden = true;
    content.hidden = false;
  }

  function getChapterList() {
    const book = books.get(currentBook);

    if (!book) {
      return [];
    }

    return Array.from(book.chapters).sort((a, b) => a - b);
  }

  function getCurrentLocation() {
    const orderedBooks = getOrderedBooks();
    const bookIndex = orderedBooks.findIndex(
      book => book.abbreviation === currentBook
    );

    const chapters = getChapterList();
    const chapterIndex = chapters.indexOf(currentChapter);

    return {
      orderedBooks,
      bookIndex,
      chapters,
      chapterIndex
    };
  }

  function updateNavigationButtons() {
    const {
      orderedBooks,
      bookIndex,
      chapters,
      chapterIndex
    } = getCurrentLocation();

    previousButton.disabled =
      bookIndex === 0 && chapterIndex === 0;

    nextButton.disabled =
      bookIndex === orderedBooks.length - 1 &&
      chapterIndex === chapters.length - 1;
  }

  function goPrevious() {
    const {
      orderedBooks,
      bookIndex,
      chapters,
      chapterIndex
    } = getCurrentLocation();

    if (chapterIndex > 0) {
      currentChapter = chapters[chapterIndex - 1];
    } else if (bookIndex > 0) {
      const previousBook = orderedBooks[bookIndex - 1];

      currentBook = previousBook.abbreviation;

      const previousChapters = Array.from(
        previousBook.chapters
      ).sort((a, b) => a - b);

      currentChapter =
        previousChapters[previousChapters.length - 1];
    } else {
      return;
    }

    syncSelectors();
    renderChapter();
  }

  function goNext() {
    const {
      orderedBooks,
      bookIndex,
      chapters,
      chapterIndex
    } = getCurrentLocation();

    if (chapterIndex < chapters.length - 1) {
      currentChapter = chapters[chapterIndex + 1];
    } else if (bookIndex < orderedBooks.length - 1) {
      const nextBook = orderedBooks[bookIndex + 1];

      currentBook = nextBook.abbreviation;

      const nextChapters = Array.from(
        nextBook.chapters
      ).sort((a, b) => a - b);

      currentChapter = nextChapters[0];
    } else {
      return;
    }

    syncSelectors();
    renderChapter();
  }

  function syncSelectors() {
    bookSelect.value = currentBook;
    populateChapters();
    chapterSelect.value = String(currentChapter);
  }

  function readUrl() {
    const parameters = new URLSearchParams(window.location.search);
    const requestedBook = parameters.get("book");
    const requestedChapter = Number(parameters.get("chapter"));

    if (requestedBook && books.has(requestedBook)) {
      currentBook = requestedBook;
    } else {
      currentBook = getOrderedBooks()[0].abbreviation;
    }

    const availableChapters = Array.from(
      books.get(currentBook).chapters
    );

    if (
      Number.isInteger(requestedChapter) &&
      availableChapters.includes(requestedChapter)
    ) {
      currentChapter = requestedChapter;
    } else {
      currentChapter = Math.min(...availableChapters);
    }
  }

  function updateUrl() {
    const url = new URL(window.location.href);

    url.searchParams.set("book", currentBook);
    url.searchParams.set(
      "chapter",
      String(currentChapter)
    );

    history.replaceState(null, "", url);
  }

  languageControls.addEventListener("click", event => {
    const button = event.target.closest("button[data-text]");

    if (!button) {
      return;
    }

    const buttons = Array.from(
      languageControls.querySelectorAll("button[data-text]")
    );

    const activeButtons = buttons.filter(
      candidate =>
        candidate.getAttribute("aria-pressed") === "true"
    );

    const isActive =
      button.getAttribute("aria-pressed") === "true";

    if (isActive && activeButtons.length === 1) {
      return;
    }

    button.setAttribute("aria-pressed", String(!isActive));
    button.classList.toggle("active", !isActive);

    saveSelectedTexts();
    renderChapter();
  });

  bookSelect.addEventListener("change", () => {
    currentBook = bookSelect.value;

    const chapters = Array.from(
      books.get(currentBook).chapters
    ).sort((a, b) => a - b);

    currentChapter = chapters[0];

    populateChapters();
    renderChapter();
  });

  chapterSelect.addEventListener("change", () => {
    currentChapter = Number(chapterSelect.value);
    renderChapter();
  });

  previousButton.addEventListener("click", goPrevious);
  nextButton.addEventListener("click", goNext);

  async function start() {
    try {
      await loadAllSources();

      restoreSelectedTexts();
      populateBooks();
      readUrl();
      syncSelectors();
      renderChapter();
    } catch (error) {
      console.error(error);
      status.textContent = error.message;
    }
  }

  start();
})();
