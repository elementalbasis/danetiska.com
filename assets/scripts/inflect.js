(() => {
  const TEMPLATE_MAP = {
    "1": "a_stem_endings",
    "2": "o_stem_animate_endings",
    "3": "o_stem_neuter_endings",
    "4": "i_stem_animate_endings",
    "5": "i_stem_neuter_endings",
    "6": "u_stem_animate_endings",
    "7": "u_stem_neuter_endings",
    "8": "n_stem_endings",
    "9": "s_stem_endings",
  };

  const CASE_ROWS = [
    ["nom", "nom."],
    ["voc", "voc."],
    ["acc", "acc."],
    ["gen", "gen."],
    ["abl", "abl."],
    ["dat", "dat."],
    ["loc", "loc."],
    ["ins", "ins."]
  ];

  let ENDINGS_CACHE = null;
  let LOAD_PROMISE = null;

  async function loadEndings() {
    if (ENDINGS_CACHE) return ENDINGS_CACHE;
    if (LOAD_PROMISE) return LOAD_PROMISE;

    LOAD_PROMISE = fetch("/assets/lexicon/endings.yaml", { cache: "no-store" })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Could not load /assets/lexicon/endings.yaml (${response.status})`);
        }
        return response.text();
      })
      .then(text => {
        if (typeof jsyaml === "undefined") {
          throw new Error("jsyaml is not defined. Load js-yaml before inflect.js.");
        }
        ENDINGS_CACHE = jsyaml.load(text);
        return ENDINGS_CACHE;
      });

    return LOAD_PROMISE;
  }

  function inflect(root1, root2, endings) {
    return {
      "nom-sg": root1 + endings["nom-sg"],
      "voc-sg": root1 + endings["voc-sg"],
      "acc-sg": root1 + endings["acc-sg"],
      "gen-sg": root2 + endings["gen-sg"],
      "abl-sg": root2 + endings["abl-sg"],
      "dat-sg": root2 + endings["dat-sg"],
      "loc-sg": root2 + endings["loc-sg"],
      "ins-sg": root2 + endings["ins-sg"],
      "nom-pl": root1 + endings["nom-pl"],
      "voc-pl": root1 + endings["voc-pl"],
      "acc-pl": root1 + endings["acc-pl"],
      "gen-pl": root2 + endings["gen-pl"],
      "abl-pl": root2 + endings["abl-pl"],
      "dat-pl": root2 + endings["dat-pl"],
      "loc-pl": root2 + endings["loc-pl"],
      "ins-pl": root2 + endings["ins-pl"]
    };
  }

  function buildInflectionTable(forms) {
    const wrapper = document.createElement("div");
    wrapper.className = "infl-rendered";

    const title = document.createElement("div");
    title.className = "infl-title";
    title.textContent = "Inflection";
    wrapper.appendChild(title);

    const table = document.createElement("table");
    table.className = "infl-table";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");

    const blank = document.createElement("th");
    blank.textContent = "";
    headRow.appendChild(blank);

    const sg = document.createElement("th");
    sg.textContent = "sg.";
    headRow.appendChild(sg);

    const pl = document.createElement("th");
    pl.textContent = "pl.";
    headRow.appendChild(pl);

    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (const [caseKey, label] of CASE_ROWS) {
      const tr = document.createElement("tr");

      const caseTh = document.createElement("th");
      caseTh.textContent = label;
      tr.appendChild(caseTh);

      const sgTd = document.createElement("td");
      sgTd.textContent = forms[`${caseKey}-sg`];
      tr.appendChild(sgTd);

      const plTd = document.createElement("td");
      plTd.textContent = forms[`${caseKey}-pl`];
      tr.appendChild(plTd);

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    wrapper.appendChild(table);
    return wrapper;
  }

  async function renderInflDiv(div) {
    if (!div || div.dataset.inflProcessed === "1") return;

    const templateId = div.dataset.inflectionTemplate;
    const root1 = div.dataset.root1 || "";
    const root2 = div.dataset.root2 || root1;

    if (!templateId) {
      console.warn("Missing data-inflection-template:", div);
      return;
    }

    const yamlData = await loadEndings();
    const endingsKey = TEMPLATE_MAP[templateId];

    if (!endingsKey) {
      console.warn("Unknown inflection template id:", templateId, div);
      return;
    }

    const endings = yamlData[endingsKey];
    if (!endings) {
      console.warn("Missing endings set in YAML:", endingsKey, div);
      return;
    }

    const forms = inflect(root1, root2, endings);

    div.innerHTML = "";
    div.appendChild(buildInflectionTable(forms));
    div.dataset.inflProcessed = "1";
  }

  async function renderAllInflections(root = document) {
    const divs = root.querySelectorAll ? root.querySelectorAll(".infl") : [];
    for (const div of divs) {
      await renderInflDiv(div);
    }
  }

  function watchForInflections() {
    const observer = new MutationObserver(async mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;

          if (node.matches && node.matches(".infl")) {
            await renderInflDiv(node);
          }

          if (node.querySelectorAll) {
            await renderAllInflections(node);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  async function initInflector() {
    await loadEndings();
    await renderAllInflections(document);
    watchForInflections();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initInflector().catch(err => console.error("Inflector failed:", err));
    });
  } else {
    initInflector().catch(err => console.error("Inflector failed:", err));
  }

  window.initInflector = initInflector;
})();
