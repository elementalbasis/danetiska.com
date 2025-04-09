window.MathJax = {
  loader: {load: ['[tex]/physics', '[tex]/cancel']},
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    packages: ['base', 'ams', 'physics', 'cancel']
    /*macros: {
      d: "\\mathrm{d}",
      dd: ["\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}", 2],
      pd: "\\partial",
      pp: ["\\frac{\\partial #1}{\\partial #2}", 2]
    }
    */
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    ignoreHtmlClass: 'no-mathjax',
  }
};

