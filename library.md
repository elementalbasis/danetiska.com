---
layout: default
title: Library
---

<header class="library-intro">
  <h1>Library</h1>
  <p>
    Historical, literary, linguistic, and scientific works published
    or preserved by the Danetian Academy.
  </p>
</header>

<section class="library-list">

{% assign works = site.data.bibliography | sort: "title" %}

{% for work in works %}
<a class="library-item" href="{{ work.url }}">

    <p class="library-meta">
        {{ work.type }}
        {% if work.year %} · {{ work.year }}{% endif %}
    </p>

    <h2 class="library-title">
        {{ work.title }}
    </h2>

    <p class="library-author">
        {{ work.author }}
    </p>

    {% if work.description %}
    <p class="library-description">
        {{ work.description }}
    </p>
    {% endif %}

</a>
{% endfor %}

</section>
