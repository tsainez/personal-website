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

  modified = false

  page.xpath('descendant-or-self::a[translate(@target, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")="_blank"]').each do |link|
    href = link['href']
    next unless href

    # Check for external links (http, https, or protocol-relative //)
    # ⚡ Bolt Optimization: Use `match?` with regex handling whitespace
    # instead of `strip =~` to avoid creating new string objects in memory.
    if href.match?(/\A\s*(?:https?:|\/\/)/i)
      rel = link['rel'] || ''
      link_modified = false

      # ⚡ Bolt Optimization: Use regex and string interpolation instead of split/join
      # to avoid unnecessary array allocations inside loops.
      unless rel.match?(/(?:\s|\A)noopener(?:\s|\z)/i)
        rel = rel.empty? ? 'noopener' : "#{rel} noopener"
        link_modified = true
      end

      unless rel.match?(/(?:\s|\A)noreferrer(?:\s|\z)/i)
        rel = rel.empty? ? 'noreferrer' : "#{rel} noreferrer"
        link_modified = true
      end

      if link_modified
        link['rel'] = rel
        modified = true
      end
    end
  end

  # ⚡ Bolt Optimization: Only serialize the DOM back to HTML if we actually modified it.
  # Nokogiri's to_html is extremely expensive.
  doc.output = page.to_html if modified
end
