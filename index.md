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
  <!--<h2>Danetian Language and Worldbuilding</h2>-->
  <div class="post-grid">
    {% assign shown = 0 %}
    {% for post in site.posts %}
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
  <h2>Affiliated projects</h2>
  <div class="post-grid">
    <article class="post-card">
      <a href="https://elementalbasis.com" class="card-link">
        <figure class="card-figure">
          <img
            src="https://elementalbasis.com/assets/images/eb_logo.svg"
            alt="Elemental Basis"
            loading="lazy" decoding="async">
        </figure>
        <div class="card-body">
          <h2 class="card-title">Elemental Basis</h2>
          <p class="card-excerpt">A blog for math and physics nerds.</p>
          <div class="card-meta">
          </div>
        </div>
      </a>
    </article>
  </div>
</section>

