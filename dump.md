---
layout: page
title: dumping
permalink: /dump/
---

{% for tag in site.tags %}
  <ul>
    {% for post in site.tags[tag] %}
      <li>
        {{post.title}} at {{post.url}} with tag: {{tag}}
      </li>
    {% endfor %}
  </ul>
{% endfor %}

{% for post in site.posts %}
  {{post.title}}
{% endfor %}

{% for x in site.write_ind %}
  {{x.title}}
{% endfor %}
