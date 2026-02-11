# frozen_string_literal: true

require 'nokogiri'

Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  # Only process HTML files
  next unless doc.output_ext == ".html"

  # Parse the document (full document, not fragment, to preserve head/body structure)
  # Use Nokogiri::HTML explicitly to handle full HTML documents
  doc_html = Nokogiri::HTML(doc.output)

  # Select headers (h2-h6) that have an ID
  headers = doc_html.css('h2[id], h3[id], h4[id], h5[id], h6[id]')

  headers.each do |header|
    # Skip if an anchor link already exists (e.g. manually added)
    next if header.css('.anchor-link').any?

    # Create the anchor link element
    anchor = Nokogiri::XML::Node.new "a", doc_html
    anchor['class'] = 'anchor-link'
    anchor['href'] = "##{header['id']}"
    anchor['aria-label'] = 'Link to section'
    anchor.content = '#'

    # Append the anchor link to the header
    header.add_child(anchor)
  end

  # Update the document output
  doc.output = doc_html.to_html
end
