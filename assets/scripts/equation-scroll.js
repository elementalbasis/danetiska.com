function markScrollableEquations() {
  document.querySelectorAll('mjx-container[display="true"]').forEach((el) => {
    const scrollable = el.scrollWidth > el.clientWidth + 1;
    el.classList.toggle("math-scrollable", scrollable);
  });
}

window.addEventListener("load", markScrollableEquations);
window.addEventListener("resize", markScrollableEquations);

if (window.MathJax?.startup?.promise) {
  MathJax.startup.promise.then(markScrollableEquations);
}
