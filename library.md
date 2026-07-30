---
layout: default
title: Library
permalink: /library/
---

<h1>Library</h1>

<nav class="tag-menu">
  <button type="button" data-tag="all" class="active">All</button>
  <button type="button" data-tag="book">Books</button>
  <button type="button" data-tag="paper">Papers</button>
  <button type="button" data-tag="manual">Manuals</button>
  <button type="button" data-tag="thesis">Theses</button>
</nav>

<section class="library-list">
  {% assign items = site.data.bibliography | sort: "title" %}

  {% for item in items %}
    <div
      class="archive-item"
      data-tags='{{ item.type | split: "|" | jsonify | downcase }}'
    >
      {% include library.html item=item %}
    </div>
  {% endfor %}
</section>

<script src="{{ '/assets/scripts/filter.js' | relative_url }}" defer></script>
