---
layout: default
title: Reference catalogue
permalink: /library/reference/
---

{% include page-heading.html title=page.title description="Books, papers, manuals, and theses supporting the Academy's work." parent_url="/library/" parent_title="Library" %}

{% include filter-menu.html items=site.data.library.filters label="Filter reference works" %}

<section class="library-list" aria-label="Reference works">
  {% assign items = site.data.bibliography | sort: "title" %}
  {% for item in items %}
    <div class="archive-item" data-tags='{{ item.type | split: "|" | jsonify | downcase }}'>
      {% include library.html item=item %}
    </div>
  {% endfor %}
</section>

<script src="{{ '/assets/scripts/filter.js' | relative_url }}" defer></script>
