---
layout: page
title: All post
permalink: /post/
---
<div class="row">
  <div class="col-xm-6 col-sm-6 col-md-6 col-lg-6">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">English</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Url</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {% assign number= 0 %}
            {% for post in site.tags['english'] %}
            <tr>
              {% if forloop.last %} {% assign number= forloop.index %} {% endif %}
              <td>{{ forloop.index }}</td>
              <td>{{post.title}}</td>
              <td><a href="{{post.url}}">Click me</a></td>
              <td>{{post.date| date: "%B %d, %Y"}}</td>
            </tr>
            {% endfor %}
            {% for post in site.write_eng %}
            <tr>
              <td>{{ forloop.index| plus: number }}</td>
              <td>{{post.title}}</td>
              <td><a href="{{post.title}}">Click me</a></td>
              <td>{{post.date| date: "%B %d, %Y"}}
            </tr>
            {% endfor %}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="col-xm-6 col-sm-6 col-md-6 col-lg-6">
    <div class="panel panel-danger">
      <div class="panel-heading">
        <h3 class="panel-title">Indonesia</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Nomor</th>
              <th>Judul</th>
              <th>Url</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
              {% assign number= 0 %}
              {% for post in site.tags['indonesian'] %}
              <tr>
                {% if forloop.last %} {% assign number= forloop.index %} {% endif %}
                <td>{{ forloop.index }}</td>
                <td>{{post.title}}</td>
                <td><a href="{{post.url}}">Selengkapnya</a></td>
                <td>{{post.date| date: "%B %d, %Y" }}</td>
              </tr>
              {% endfor %}
              {% for post in site.write_ind %}
              <tr>
                <td>{{ forloop.index| plus: number }}</td>
                <td>{{post.title}}</td>
                <td><a href="{{post.url}}">Selengkapnya</a></td>
                <td>{{post.date| date: "%b %d, %Y"}}</td>
              </tr>
              {% endfor %}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
