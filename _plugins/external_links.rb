Jekyll::Hooks.register [:documents, :pages], :post_render do |doc|
  next unless doc.output_ext == ".html"

  doc.output.gsub!(/<a\s+[^>]+>/i) do |match|
    # Check for target="_blank" (case insensitive, allowing spaces)
    is_blank = match =~ /target\s*=\s*(["'])_blank\1/i

    # Check for external href (case insensitive, allowing spaces)
    # Matches href="http://...", href="https://...", href="//..."
    is_external = match =~ /href\s*=\s*(["'])(?:(?:https?:)?\/\/)/i

    if is_blank && is_external
      if match =~ /rel\s*=\s*(["'])(.*?)\1/i
        # Rel exists, check inside it
        match.sub(/rel\s*=\s*(["'])(.*?)\1/i) do |m|
           quote = $1
           content = $2
           new_content = content.dup
           new_content << ' noopener' unless new_content =~ /\bnoopener\b/i
           new_content << ' noreferrer' unless new_content =~ /\bnoreferrer\b/i
           "rel=#{quote}#{new_content}#{quote}"
        end
      else
        # Rel does not exist, add it
        match.sub('>', ' rel="noopener noreferrer">')
      end
    else
      match
    end
  end
end
