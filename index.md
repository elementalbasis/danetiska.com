---
title: Danetian Academy
layout: default
---

{% include page-heading.html title=page.title description=site.description %}

<section class="home-reference" aria-label="Dictionary">
  {% include search.html language="en" %}
  {% include word_of_the_day.html %}
</section>

<section class="resource-section" aria-labelledby="home-articles">
  <header class="section-header">
    <h2 id="home-articles">Articles</h2>
    <a href="{{ '/posts/' | relative_url }}">Browse all articles →</a>
  </header>
  <div class="card-grid">
    {% for post in site.posts limit:4 %}
      {% if forloop.first %}{% include card.html item=post featured=true %}{% else %}{% include card.html item=post %}{% endif %}
    {% endfor %}
  </div>
</section>

<section class="resource-section" aria-labelledby="home-library">
  <header class="section-header">
    <h2 id="home-library">Library</h2>
    <a href="{{ '/library/' | relative_url }}">Explore the Library →</a>
  </header>
  <div class="library-list library-list--compact">
    {% for collection in site.data.library.collections %}
      {% include library.html item=collection heading=3 %}
    {% endfor %}
  </div>
</section>

<section class="resource-section" aria-labelledby="home-projects">
  <h2 class="section-heading" id="home-projects">Affiliated projects</h2>
  <div class="card-grid">
    {% for project in site.data.projects %}{% include card.html item=project %}{% endfor %}
  </div>
</section>
