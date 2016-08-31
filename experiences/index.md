---
layout: page
title: Documented Experiences
permalink: /experiences/
---

{% if page.paginator %}
{% assign paginator= page.paginator %}
{% endif %}
<div class="list-group">
  {% for post in site.experiences %}
    <div class="list-group-item">
      <div class="row-action-primary">
        <i class="fa fa-file-code-o"></i>
      </div>
      <div class="row-content">
        <div class="least-content">{{post.date| date_to_string}}</div>
        <h4 class="list-group-item-heading">{{post.title}}</h4>
        <p>
          {{post.content| strip_html | truncate: 70 }} <a href="{{post.url}}">More</a>
        </p>
      <div class="list-group-separator">
      </div>
    </div>
  {% endfor %}
</div>
