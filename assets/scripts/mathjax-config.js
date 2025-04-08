window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    macros: {
      d: "\\mathrm{d}",
      dd: ["\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}", 2],
      pd: "\\partial",
      pp: ["\\frac{\\partial #1}{\\partial #2}", 2]
    }
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    ignoreHtmlClass: 'no-mathjax',
  }
};

