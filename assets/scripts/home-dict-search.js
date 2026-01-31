// home-dict-search.js
// Home page dictionary search: redirects to dictionary.html with ?q=...

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("homeDictForm");
  const input = document.getElementById("homeDictQuery");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const q = (input.value || "").trim();
    if (!q) return;

    // Robust relative URL: works on GitHub Pages subpaths too.
    const url = new URL("./dictionary.html", window.location.href);
    url.searchParams.set("q", q);
    window.location.href = url.toString();
  });
});

