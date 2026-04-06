---
title: Danetian Academy
layout: default
---

{% include dictionary_search.html %}
{% include word_of_the_day.html %}

{% assign featured_post = site.posts.first %}

<section class="home-featured">
  {% include featured.html post=featured_post %}
</section>

<p class="all-posts-link">
  <a href="/posts/">Browse all posts →</a>
</p>

<section class="home-section">
  <h2>Danetian Language and Worldbuilding</h2>
  <div class="post-grid">
    {% assign shown = 0 %}
    {% for post in site.posts %}
      {% if post.url != featured_post.url and shown < 3 %}
        {% if post.tags contains "worldbuilding" or post.tags contains "calendar" or post.tags contains "conlang" %}
          {% include post-card.html post=post %}
          {% assign shown = shown | plus: 1 %}
        {% endif %}
      {% endif %}
    {% endfor %}
  </div>
</section>

<p class="all-posts-link">
  <a href="/posts/">Browse all posts →</a>
</p>

<section class="home-section">
  <h2>Mathematics, Physics, and Computing</h2>
  <div class="post-grid">
    {% assign shown = 0 %}
    {% for post in site.posts %}
      {% if post.url != featured_post.url and shown < 3 %}
        {% if post.tags contains "math" or post.tags contains "physics" or post.tags contains "computing" %}
          {% include post-card.html post=post %}
          {% assign shown = shown | plus: 1 %}
        {% endif %}
      {% endif %}
    {% endfor %}
  </div>
</section>

<p class="all-posts-link">
  <a href="/posts/">Browse all posts →</a>
</p>
