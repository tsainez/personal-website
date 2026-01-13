# frozen_string_literal: true

require 'nokogiri'

module Jekyll
  # This hook processes all pages and posts after they are rendered.
  # It finds external links with target="_blank" and ensures they have
  # rel="noopener noreferrer" to prevent reverse tabnabbing attacks.
  #
  # Vulnerability: Reverse Tabnabbing
  # Impact: High - A linked page can rewrite the original page's location.
  Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
    # Only process HTML documents
    if doc.output_ext == '.html'
      # Parse the document
      content = Nokogiri::HTML::DocumentFragment.parse(doc.output)
      modified = false

      # Find all links with target="_blank"
      content.css('a[target="_blank"]').each do |link|
        rel = (link['rel'] || '').split(' ')

        # Add 'noopener' if missing
        unless rel.include?('noopener')
          rel << 'noopener'
          modified = true
        end

        # Add 'noreferrer' if missing (defense in depth)
        unless rel.include?('noreferrer')
          rel << 'noreferrer'
          modified = true
        end

        if modified
          link['rel'] = rel.uniq.join(' ')
        end
      end

      # Update the document output if changes were made
      doc.output = content.to_html if modified
    end
  end
end
