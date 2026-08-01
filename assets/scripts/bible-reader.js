document.addEventListener("DOMContentLoaded", () => {
  const dataElement = document.getElementById("bible-data");
  const textElement = document.getElementById("bible-text");
  const titleElement = document.getElementById("bible-title");
  const subtitleElement = document.getElementById("bible-subtitle");

  const bookSelect = document.getElementById("bible-book");
  const chapterSelect = document.getElementById("bible-chapter");
  const previousButton = document.getElementById("bible-previous");
  const nextButton = document.getElementById("bible-next");

  if (!dataElement || !textElement) {
    return;
  }

  let bible;

  try {
    bible = JSON.parse(dataElement.textContent);
  } catch (error) {
    console.error("Could not parse Bible data:", error);
    textElement.textContent = "The Bible text could not be loaded.";
    return;
  }

  const languageNames = {
    dan: "Danetian",
    eng: "English",
    grk: "Greek",
    sla: "Slavonic",
    lat: "Latin"
  };

  const languageCodes = {
    dan: "x-dan",
    eng: "en",
    grk: "grc",
    sla: "cu",
    lat: "la"
  };

  const supportingLanguages = ["eng", "grk", "sla", "lat"];

  function chapterNumbers(book) {
    return Object.keys(bible[book] || {}).sort((a, b) => {
      return Number(a) - Number(b);
    });
  }

  function readLocation() {
    const parameters = new URLSearchParams(window.location.search);
    const books = Object.keys(bible);

    let book = parameters.get("book");
    let chapter = parameters.get("chapter");

    if (!book || !bible[book]) {
      book = books[0];
    }

    const chapters = chapterNumbers(book);

    if (!chapter || !bible[book][chapter]) {
      chapter = chapters[0];
    }

    return { book, chapter };
  }

  function writeLocation(book, chapter, replace = false) {
    const url = new URL(window.location.href);

    url.searchParams.set("book", book);
    url.searchParams.set("chapter", chapter);
    url.hash = "";

    if (replace) {
      history.replaceState({ book, chapter }, "", url);
    } else {
      history.pushState({ book, chapter }, "", url);
    }
  }

  function populateBooks(selectedBook) {
    bookSelect.replaceChildren();

    for (const book of Object.keys(bible)) {
      const option = document.createElement("option");
      option.value = book;
      option.textContent = formatBookName(book);
      option.selected = book === selectedBook;
      bookSelect.appendChild(option);
    }
  }

  function populateChapters(book, selectedChapter) {
    chapterSelect.replaceChildren();

    for (const chapter of chapterNumbers(book)) {
      const option = document.createElement("option");
      option.value = chapter;
      option.textContent = chapter;
      option.selected = chapter === selectedChapter;
      chapterSelect.appendChild(option);
    }
  }

  function formatBookName(book) {
    return book
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, character => character.toUpperCase());
  }

  function makeLanguageBlock(language, text, primary = false) {
    const block = document.createElement("div");
    block.className = primary
      ? "bible-language bible-danetian"
      : "bible-language";

    const label = document.createElement("p");
    label.className = "bible-language-name";
    label.textContent = languageNames[language] || language;

    const paragraph = document.createElement("p");
    paragraph.lang = languageCodes[language] || "";
    paragraph.textContent = text;

    block.append(label, paragraph);

    return block;
  }

  function renderChapter(book, chapter) {
    const chapterData = bible[book]?.[chapter];

    if (!chapterData) {
      titleElement.textContent = "Chapter not found";
      subtitleElement.textContent = "";
      textElement.textContent = "The requested chapter does not exist.";
      return;
    }

    titleElement.textContent =
      chapterData.title || `${formatBookName(book)} ${chapter}`;

    subtitleElement.textContent = chapterData.subtitle || "";
    subtitleElement.hidden = !chapterData.subtitle;

    textElement.replaceChildren();

    for (const unit of chapterData.units || []) {
      const section = document.createElement("section");
      section.className = "bible-unit";
      section.id = `v${unit.id}`;

      const number = document.createElement("a");
      number.className = "bible-verse-number";
      number.href = `#v${unit.id}`;
      number.textContent = unit.id;
      number.setAttribute("aria-label", `Verse ${unit.id}`);

      const body = document.createElement("div");
      body.className = "bible-unit-body";

      if (unit.dan) {
        body.appendChild(makeLanguageBlock("dan", unit.dan, true));
      }

      const translations = document.createElement("div");
      translations.className = "bible-translations";

      for (const language of supportingLanguages) {
        if (unit[language]) {
          translations.appendChild(
            makeLanguageBlock(language, unit[language])
          );
        }
      }

      if (translations.childElementCount > 0) {
        body.appendChild(translations);
      }

      section.append(number, body);
      textElement.appendChild(section);
    }

    document.title =
      `${titleElement.textContent} | Danetian Academy`;

    updateNavigation(book, chapter);
  }

  function updateNavigation(book, chapter) {
    const books = Object.keys(bible);
    const bookIndex = books.indexOf(book);
    const chapters = chapterNumbers(book);
    const chapterIndex = chapters.indexOf(chapter);

    let previous = null;
    let next = null;

    if (chapterIndex > 0) {
      previous = {
        book,
        chapter: chapters[chapterIndex - 1]
      };
    } else if (bookIndex > 0) {
      const previousBook = books[bookIndex - 1];
      const previousChapters = chapterNumbers(previousBook);

      previous = {
        book: previousBook,
        chapter: previousChapters[previousChapters.length - 1]
      };
    }

    if (chapterIndex < chapters.length - 1) {
      next = {
        book,
        chapter: chapters[chapterIndex + 1]
      };
    } else if (bookIndex < books.length - 1) {
      const nextBook = books[bookIndex + 1];
      const nextChapters = chapterNumbers(nextBook);

      next = {
        book: nextBook,
        chapter: nextChapters[0]
      };
    }

    previousButton.disabled = !previous;
    nextButton.disabled = !next;

    previousButton.onclick = previous
      ? () => navigate(previous.book, previous.chapter)
      : null;

    nextButton.onclick = next
      ? () => navigate(next.book, next.chapter)
      : null;
  }

  function navigate(book, chapter, replace = false) {
    populateBooks(book);
    populateChapters(book, chapter);
    renderChapter(book, chapter);
    writeLocation(book, chapter, replace);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  bookSelect.addEventListener("change", () => {
    const book = bookSelect.value;
    const chapter = chapterNumbers(book)[0];
    navigate(book, chapter);
  });

  chapterSelect.addEventListener("change", () => {
    navigate(bookSelect.value, chapterSelect.value);
  });

  window.addEventListener("popstate", () => {
    const { book, chapter } = readLocation();
    populateBooks(book);
    populateChapters(book, chapter);
    renderChapter(book, chapter);
  });

  const initial = readLocation();

  populateBooks(initial.book);
  populateChapters(initial.book, initial.chapter);
  renderChapter(initial.book, initial.chapter);
  writeLocation(initial.book, initial.chapter, true);
});
