require 'nokogiri'

Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  parsed_doc = Nokogiri::HTML(doc.output)

  parsed_doc.css('a').each do |a|
    next unless a['href']

    # Check if target is _blank
    next unless a['target'] == '_blank'

    # Check if external link
    href = a['href'].strip
    is_external = href.match?(%r{\A(?:https?:)?//})

    next unless is_external

    # Add rel attributes
    rel = (a['rel'] || '').split(/\s+/)
    rel << 'noopener' unless rel.include?('noopener')
    rel << 'noreferrer' unless rel.include?('noreferrer')

    a['rel'] = rel.join(' ')
  end

  doc.output = parsed_doc.to_html
end
