---
title: Dictionary of the Danetian language
layout: standalone
inflections: true
wide: true
---

{% include search.html language="en" %}
{% include word_of_the_day.html %}

<section class="dictionary-introduction">

  <div class="dictionary-description">

    <p class="lead">
      The <em>Dictzionariom Danetiskas Dyndjuas</em> is the principal
      lexicographical work of the Danetian Academy. It records the vocabulary
      of the Danetian language together with its meanings, grammatical
      information, etymology, and usage.
    </p>

    <p>
      The dictionary is a continuing work. Its entries are revised and
      expanded as the Academy's linguistic research progresses and as new
      evidence becomes available from written texts and contemporary usage.
    </p>

    <p>
      Also available in <a href="/assets/lexicon/dictionary.pdf">PDF format</a>.
    </p>

  </div>

  <img
    class="dictionary-logo"
    src="{{ '/assets/images/dictionary_of_the_danetian_language_logo.svg' | relative_url }}"
    alt="">

</section>

<section class="results">
  <p id="out" role="status" aria-live="polite"></p>
  <div id="results"></div>
</section>

<script src="{{ "/assets/scripts/dictionary.js" | relative_url }}" defer></script>
