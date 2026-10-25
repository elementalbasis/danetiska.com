---
layout: default
title: Articles
permalink: /posts/
---

{% include page-heading.html title=page.title description="Studies of Danetian language, history, culture, and civic life, alongside news and announcements." %}

{% include filter-menu.html items=site.data.article_filters label="Filter articles" %}

<section class="card-grid">
  {% for post in site.posts %}
    <div class="archive-item" data-tags='{{ post.tags | jsonify | downcase }}'>
      {% include card.html item=post %}
    </div>
  {% endfor %}
</section>

<script src="{{ '/assets/scripts/filter.js' | relative_url }}" defer></script>
