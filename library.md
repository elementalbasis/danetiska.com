---
layout: default
title: Library
permalink: /library/
---

{% include page-heading.html title=page.title description=site.data.library.introduction %}

<section class="collection-grid" aria-label="Library collections">
  {% for collection in site.data.library.collections %}
    {% include collection-card.html item=collection %}
  {% endfor %}
</section>

<section class="resource-section" aria-labelledby="library-tools-heading">
  <h2 class="section-heading" id="library-tools-heading">Tools</h2>
  <div class="library-list library-list--compact">
    {% for tool in site.data.library.tools %}
      {% include library.html item=tool heading=3 %}
    {% endfor %}
  </div>
</section>
