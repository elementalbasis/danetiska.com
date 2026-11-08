/* Expand all conjugation sections when the outer disclosure opens. */
(() => {
  // Capture toggle on dynamically cloned search results as well as initial entries.
  document.addEventListener('toggle', (event) => {
    const outer = event.target;
    if (outer.matches('details.inflections') && outer.open) {
      outer.querySelectorAll('details.infl-section').forEach(section => { section.open = true; });
    }
  }, true);
})();
