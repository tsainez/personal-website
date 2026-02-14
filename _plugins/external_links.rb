Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  require 'nokogiri'

  raw_html = doc.output
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
