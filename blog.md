---
layout: default
title: Blog Posts
---
# {{ page.title }}

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a><br>
      <small>{{ post.date | date: "%d %B %Y" }}</small>
    </li>
  {% endfor %}
</ul>
