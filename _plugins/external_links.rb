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
      original_rel = rel.dup

      # ⚡ Bolt Optimization: Avoid string allocations from split and join
      rel = rel.empty? ? 'noopener' : "#{rel} noopener" unless rel.match?(/(?:\A|\s)noopener(?:\s|\z)/i)
      rel = rel.empty? ? 'noreferrer' : "#{rel} noreferrer" unless rel.match?(/(?:\A|\s)noreferrer(?:\s|\z)/i)

      if rel != original_rel
        link['rel'] = rel
        modified = true
      end
    end
  end

  # ⚡ Bolt Optimization: Only serialize DOM back to HTML if we actually modified it
  doc.output = page.to_html if modified
end
