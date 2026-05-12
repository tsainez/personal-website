---
layout: page
title: Site Map
permalink: /image-map/
---

A prototype of a classic HTML image map. The illustration below uses `<img usemap>`
with a `<map>` element containing three `<area>` hotspots — one rectangle, one
circle, and one polygon. Each region links to a page on this site.

<div class="image-map-frame" markdown="0">
<img src="{{ '/assets/images/site-map.svg' | relative_url }}"
     usemap="#site-map"
     alt="Illustrated site map. Click the house for the About page, the sun for the home page, or the signpost for the essay."
     width="800"
     height="500"
     class="image-map-img" />

<map name="site-map">
  <area shape="rect"
        coords="80,180,300,420"
        href="{{ '/about/' | relative_url }}"
        alt="About"
        title="About" />
  <area shape="circle"
        coords="680,110,55"
        href="{{ '/' | relative_url }}"
        alt="Home"
        title="Home" />
  <area shape="poly"
        coords="430,230,600,230,640,290,600,350,430,350,390,290"
        href="{% post_url 2025-07-15-who-is-driving %}"
        alt="So, who's driving?"
        title="So, who's driving?" />
</map>
</div>

### How it works

The `<img>` tag references the image and points to a named `<map>` via the
`usemap` attribute. Each `<area>` defines a clickable region in image-pixel
coordinates:

- `shape="rect"` — `coords="x1,y1,x2,y2"`
- `shape="circle"` — `coords="cx,cy,radius"`
- `shape="poly"` — `coords="x1,y1,x2,y2,...,xN,yN"`

### Known tradeoffs

Image map coordinates are pixel-based and don't scale when the image is resized
by CSS, so this prototype renders the image at its natural 800×500 size. For a
responsive version we'd reach for an SVG with embedded `<a>` elements instead.
