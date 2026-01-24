Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  doc.output.gsub!(/<a\s+(?:[^>]*?\s+)?href=(["'])(?:(?:https?):)?\/\/[^"']+\1(?:[^>]*?\s+)?target=(["'])_blank\2[^>]*>/) do |match|
    if match.include?('rel=')
      if match.include?('noopener') && match.include?('noreferrer')
        match
      else
        match.sub(/rel=(["'])(.*?)\1/, 'rel=\1\2 noopener noreferrer\1')
      end
    else
      match.sub('>', ' rel="noopener noreferrer">')
    end
  end
end
