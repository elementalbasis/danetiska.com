---
title: Danetian Academy
layout: default
---

<!--
<section class="dict-date" aria-label="Today’s date">
  <div class="dict-date__inner">
    <div class="dict-date__item">
      <span class="dict-date__value" id="gregorian_date_today">
      </span>
    </div>

    <div class="dict-date__sep" aria-hidden="true">•</div>

    <div class="dict-date__item">
      <span class="dict-date__value" id="danetian_date_today">
      </span>
    </div>
  </div>
</section>
-->

<form class="search" id="homeDictForm">
  <input
    id="homeDictQuery"
    type="search"
    name="q"
    placeholder="Search the dictionary"
    autocomplete="off"
  />
  <button type="submit">Search</button>
</form>
<script src="/assets/scripts/home-dict-search.js"></script>


{%- comment -%}
Pick the featured post: first with `featured: true`, else latest
{%- endcomment -%}
{% assign featured = site.posts | where_exp: "p","p.featured" | first %}
{% if featured == nil %}
  {% assign featured = site.posts.first %}
{% endif %}

{% include featured.html post=featured %}

<section class="post-grid">
  {%- comment -%}
  Show the rest as cards (respect pagination if enabled)
  {%- endcomment -%}
  {% if paginator %}
    {% assign posts = paginator.posts | where_exp:"p","p.url != featured.url" %}
  {% else %}
    {% assign posts = site.posts | where_exp:"p","p.url != featured.url" %}
  {% endif %}

  {% for post in posts %}
    {% include post-card.html post=post %}
  {% endfor %}
</section>

{% if paginator %}
<nav class="pager">
  {% if paginator.previous_page %}
    <a class="prev" href="{{ paginator.previous_page_path }}">&larr; Newer</a>
  {% endif %}
  <span class="page-num">Page {{ paginator.page }} of {{ paginator.total_pages }}</span>
  {% if paginator.next_page %}
    <a class="next" href="{{ paginator.next_page_path }}">Older &rarr;</a>
  {% endif %}
</nav>
{% endif %}
