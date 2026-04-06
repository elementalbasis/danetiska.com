---
title: Danetian Academy
layout: default
---

{% include dictionary_search.html %}
{% include word_of_the_day.html %}


{% assign featured_post = site.posts.first %}

{% assign danetian_posts = site.posts | where_exp: "post", "post.tags contains 'worldbuilding' or post.tags contains 'calendar' or post.tags contains 'conlang'" %}
{% assign science_posts = site.posts | where_exp: "post", "post.tags contains 'math' or post.tags contains 'physics' or post.tags contains 'computing'" %}

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
    {% for post in danetian_posts %}
      {% if post.url != featured_post.url and shown < 3 %}
        {% include post-card.html post=post %}
        {% assign shown = shown | plus: 1 %}
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
    {% for post in science_posts %}
      {% if post.url != featured_post.url and shown < 3 %}
        {% include post-card.html post=post %}
        {% assign shown = shown | plus: 1 %}
      {% endif %}
    {% endfor %}
  </div>
</section>

<p class="all-posts-link">
  <a href="/posts/">Browse all posts →</a>
</p>
