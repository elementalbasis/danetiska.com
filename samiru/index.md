---
title: Diccionario de la lengua samiruana
layout: standalone
wide: true
lang: es
permalink: /samiru/
---

{% include search.html language="es" %}

<section class="dictionary-introduction" lang="es">
  <div class="dictionary-description">
    <p>Diccionario samiruano–español y español–samiruano.</p>
    <p>Busque una palabra en samiruano o su traducción al español.
      Puede omitir las tildes y los macrones al buscar.</p>
    <p>Descargue la <a href="/samiru/samiru.pdf">versión PDF del diccionario</a>.</p>
    <p> El diccionario se ha compilado de los siguientes datos:</p>
{% capture source %}{% include samiru.txt %}{% endcapture %}
<pre class="codebox">{{ source | escape }}</pre>
  </div>
</section>

<section class="results" lang="es" aria-label="Resultados de la búsqueda">
  <p id="out" role="status" aria-live="polite"></p>
  <div id="results"></div>
</section>

<script src="{{ '/assets/scripts/dictionary.js' | relative_url }}" defer></script>
