require 'nokogiri'

Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  # Use Nokogiri to parse HTML safely, replacing brittle regex
  html_doc = Nokogiri::HTML(doc.output)
  modified = false

  # Select all <a> tags with target="_blank"
  html_doc.css('a[target="_blank"]').each do |a|
    href = a['href']
    next unless href

    # Check if external (http, https, or protocol-relative //)
    if href.match?(%r{\A(?:https?:)?//})

      # Get current rel attribute, split by whitespace to handle existing values
      rel = (a['rel'] || '').split(' ')
      link_modified = false

      # Add missing security keywords
      unless rel.include?('noopener')
        rel << 'noopener'
        link_modified = true
      end

      unless rel.include?('noreferrer')
        rel << 'noreferrer'
        link_modified = true
      end

      # Update the attribute if changed
      if link_modified
        a['rel'] = rel.join(' ')
        modified = true
      end
    end
  end

  # Only update the document output if we actually modified something.
  # This avoids unnecessary reformatting of pages that don't need changes.
  if modified
    doc.output = html_doc.to_html
  end
end
