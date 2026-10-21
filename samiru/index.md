---
title: Diccionario de la lengua samiruana
layout: standalone
permalink: /samiru/
---

{% include samiru_dictionary_search.html %}

<section class="dictionary-introduction" lang="es">
  <div class="dictionary-description">
    <p>Diccionario samiruano–español y español–samiruano.</p>
    <p>Busque una palabra en samiruano o su traducción al español.
      Puede omitir las tildes y los macrones al buscar.</p>
    <p>Descargue la <a href="/samiru/samiru.pdf">versión PDF del diccionario</a>.</p>
  </div>
</section>

<section class="results" lang="es" aria-label="Resultados de la búsqueda">
  <p id="out" role="status" aria-live="polite"></p>
  <div id="results"></div>
</section>

<script src="{{ '/assets/scripts/dictionary-samiru.js' | relative_url }}" defer></script>
