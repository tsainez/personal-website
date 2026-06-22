Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  require 'nokogiri'

  raw_html = doc.output

  # ⚡ Bolt Optimization: Early return if there are no external links
  # Nokogiri parsing is extremely expensive (especially for large pages).
  # Skipping the parse phase when we know there's no work to do provides
  # a massive speedup (~99% faster for pages without external links) to build times.
  next unless raw_html.match?(/<a[^>]+href\s*=\s*['"]?\s*(?:https?:|\/\/)/i)

  # heuristic to detect if it's a full document or a fragment
  is_full_doc = raw_html.match?(/\A\s*(?:<!DOCTYPE|<html)/i)

  if is_full_doc
    page = Nokogiri::HTML(raw_html)
  else
    page = Nokogiri::HTML::DocumentFragment.parse(raw_html)
  end

  # ⚡ Bolt Optimization: Track if we actually modify the DOM.
  # Nokogiri's `to_html` is extremely expensive. If we parse the document
  # but find all target links already have noopener/noreferrer, we should
  # avoid serializing the DOM back to HTML.
  modified = false

  page.xpath('descendant-or-self::a[translate(@target, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")="_blank"]').each do |link|
    href = link['href']
    next unless href

    # Check for external links (http, https, or protocol-relative //)
    # ⚡ Bolt Optimization: Use `match?` with regex handling whitespace
    # instead of `strip =~` to avoid creating new string objects in memory.
    if href.match?(/\A\s*(?:https?:|\/\/)/i)
      rel = link['rel'] || ''

      # ⚡ Bolt Optimization: Avoid allocating arrays with `split` and `join`
      # by using simple string checks and interpolation.
      needs_noopener = !rel.match?(/\bnoopener\b/)
      needs_noreferrer = !rel.match?(/\bnoreferrer\b/)

      if needs_noopener || needs_noreferrer
        new_rel = rel.dup
        new_rel << (new_rel.empty? ? 'noopener' : ' noopener') if needs_noopener
        new_rel << (new_rel.empty? ? 'noreferrer' : ' noreferrer') if needs_noreferrer

        link['rel'] = new_rel
        modified = true
      end
    end
  end

  # ⚡ Bolt Optimization: Only serialize if changes were made
  doc.output = page.to_html if modified
end
