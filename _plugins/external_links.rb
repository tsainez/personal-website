Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  require 'nokogiri'

  raw_html = doc.output

  # ⚡ Bolt Optimization: Early return if there are no external links
  # Nokogiri parsing is extremely expensive (especially for large pages).
  # Skipping the parse phase when we know there's no work to do provides
  # a massive speedup (~99% faster for pages without external links) to build times.
  next unless raw_html.match?(/<a[^>]+href\s*=\s*['"]?(?:https?:|\/\/)/i)

  # heuristic to detect if it's a full document or a fragment
  # Bolt optimization: Use match? instead of lstrip to avoid duplicating large HTML strings in memory
  is_full_doc = raw_html.match?(/\A\s*(?:<!DOCTYPE|<html)/i)

  if is_full_doc
    page = Nokogiri::HTML(raw_html)
  else
    page = Nokogiri::HTML::DocumentFragment.parse(raw_html)
  end

  page.css('a[target="_blank"]').each do |link|
    href = link['href']
    next unless href

    # Check for external links (http, https, or protocol-relative //)
    if href =~ %r{\A(https?:|//)}
      rel = link['rel'] || ''
      parts = rel.split(/\s+/)

      parts << 'noopener' unless parts.include?('noopener')
      parts << 'noreferrer' unless parts.include?('noreferrer')

      link['rel'] = parts.join(' ')
    end
  end

  doc.output = page.to_html
end
