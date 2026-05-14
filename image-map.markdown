---
layout: page
title: Site Map
permalink: /image-map/
---

A prototype in the spirit of an old Geocities or Neocities page: transparent
PNG cutouts scattered around, each one a clickable link. The placeholder images
below are stand-ins — drop in your own cutouts (PNGs with transparent
backgrounds) and adjust positions in `assets/main.scss` to taste.

<div class="cutout-collage" markdown="0">
  <a class="cutout cutout--polaroid" href="{{ '/about/' | relative_url }}" title="About">
    <img src="{{ '/assets/images/cutouts/polaroid.png' | relative_url }}" alt="About" width="240" height="280" />
  </a>
  <a class="cutout cutout--sticker" href="{% post_url 2025-07-15-who-is-driving %}" title="Read the blog">
    <img src="{{ '/assets/images/cutouts/sticker.png' | relative_url }}" alt="Read the blog" width="220" height="220" />
  </a>
  <a class="cutout cutout--badge" href="{{ '/' | relative_url }}" title="Home">
    <img src="{{ '/assets/images/cutouts/badge.png' | relative_url }}" alt="Home" width="180" height="180" />
  </a>
  <a class="cutout cutout--speech" href="mailto:{{ site.email | escape }}" title="Email me">
    <img src="{{ '/assets/images/cutouts/speech.png' | relative_url }}" alt="Email me" width="240" height="180" />
  </a>
  <a class="cutout cutout--button" href="https://github.com/{{ site.github_username | cgi_escape | escape }}" title="GitHub">
    <img src="{{ '/assets/images/cutouts/button88.png' | relative_url }}" alt="GitHub" width="176" height="62" />
  </a>
</div>

### How it works

Each cutout is an `<a>` wrapping an `<img>`. The container `.cutout-collage`
is `position: relative`, and each `.cutout` is `position: absolute` with its
own offsets and rotation. There's no `<map>` or `<area>` involved — the click
target is just the visible shape of the PNG, because transparent pixels don't
register pointer events on an `<img>`.

### To use your own photos

1. Cut out the subject in your photo editor of choice and export as PNG with a
   transparent background.
2. Save it to `assets/images/cutouts/`.
3. Add another `<a class="cutout cutout--yourname">` block above, and add a
   matching `.cutout--yourname` rule in `assets/main.scss` with `top`, `left`
   (or `right`/`bottom`), and a `--rot` value for the tilt.

### Tradeoffs vs. classic `<map>`/`<area>`

- ✅ Click targets follow the visible shape of each PNG — no pixel-coordinate
  bookkeeping.
- ✅ Hover/focus styling works natively (rotation, scale, glow).
- ✅ Layout is real CSS, so it stays responsive.
- ⚠️ A single irregular hotspot inside one image still needs `<map>`/`<area>`
  (or an SVG with embedded `<a>` elements). This pattern is for collages of
  separate cutouts, not regions within a single image.
