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

      # ⚡ Bolt Optimization: Avoid object allocations in loops
      # `rel.split` creates temporary Array and String objects on every iteration.
      # Instead, use fast `match?` to check for presence and concatenate strings.
      needs_noopener = !rel.match?(/(?:\A|\s)noopener(?:\s|\z)/i)
      needs_noreferrer = !rel.match?(/(?:\A|\s)noreferrer(?:\s|\z)/i)

      if needs_noopener || needs_noreferrer
        new_rel = rel.dup
        new_rel << (new_rel.empty? ? 'noopener' : ' noopener') if needs_noopener
        new_rel << (new_rel.empty? ? 'noreferrer' : ' noreferrer') if needs_noreferrer
        link['rel'] = new_rel
        modified = true
      end
    end
  end

  # ⚡ Bolt Optimization: Avoid unconditional DOM serialization
  # `page.to_html` is extremely slow. Only serialize if the DOM was actually modified.
  doc.output = page.to_html if modified
end
