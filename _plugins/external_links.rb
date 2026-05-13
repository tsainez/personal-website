Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  require 'nokogiri'

  raw_html = doc.output

  # Bolt Optimization: Fast fail with Regex before expensive Nokogiri parsing
  # If the document doesn't contain target="_blank", there's nothing to do
  next unless raw_html.match?(/target\s*=\s*['"]_blank['"]/i)

  # heuristic to detect if it's a full document or a fragment
  is_full_doc = raw_html.lstrip.start_with?("<!DOCTYPE", "<html")

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
