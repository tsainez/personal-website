Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  doc.output.gsub!(/<a\s+[^>]*>/i) do |match|
    is_blank = match.match?(/target=(["'])_blank\1/i)
    href_match = match.match(/href=(["'])((?:https?:)?\/\/.*?)(\1)/i)

    if is_blank && href_match
      if match.include?('rel=')
        if match.include?('noopener') && match.include?('noreferrer')
          match
        else
          match.sub(/rel=(["'])(.*?)\1/, 'rel=\1\2 noopener noreferrer\1')
        end
      else
        match.sub('>', ' rel="noopener noreferrer">')
      end
    else
      match
    end
  end
end
