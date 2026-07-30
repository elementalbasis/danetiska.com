---
layout: default
title: Posts
permalink: /posts/
---

<h1>Posts</h1>

<nav class="tag-menu">
  <button type="button" data-tag="all" class="active">All</button>
  <button type="button" data-tag="worldbuilding">Worldbuilding</button>
  <button type="button" data-tag="conlang">Conlang</button>
  <button type="button" data-tag="calendar">Calendar</button>
<!--
  <button type="button" data-tag="mathematics">Mathematics</button>
  <button type="button" data-tag="physics">Physics</button>
  <button type="button" data-tag="computing">Computing</button>
-->
</nav>

<section class="post-grid">
  {% for post in site.posts %}
    <div class="archive-item" data-tags='{{ post.tags | jsonify | downcase }}'>
      {% include post-card.html post=post %}
    </div>
  {% endfor %}
</section>

<script src="{{ '/assets/scripts/filter.js' | relative_url }}" defer></script>
