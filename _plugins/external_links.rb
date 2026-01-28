Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  # Regex to match external links (http, https, or protocol-relative //) with target="_blank"
  # Support both orders: href before target, and target before href
  regex_href_first = /<a\s+(?:[^>]*?\s+)?href=(["'])(?:(?:https?:)?\/\/)[^"']+\1(?:[^>]*?\s+)?target=(["'])_blank\2[^>]*>/
  regex_target_first = /<a\s+(?:[^>]*?\s+)?target=(["'])_blank\1(?:[^>]*?\s+)?href=(["'])(?:(?:https?:)?\/\/)[^"']+\2[^>]*>/

  [regex_href_first, regex_target_first].each do |regex|
    doc.output.gsub!(regex) do |match|
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
end
